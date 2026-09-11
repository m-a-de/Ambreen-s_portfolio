import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import matter from 'gray-matter';
import sharp from 'sharp';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const IMAGE_DIR = path.join(ROOT, 'public', 'images', 'blog');
const PREFERRED_IMAGE_PREFIX = '/images/blog/';
const DRY_RUN = process.argv.includes('--dry-run');
const WEBP_QUALITY = 84;
const MAX_WIDTH = 2000;
const BLOG_GIT_PATHS = ['src/content/blog', 'public/images/blog'];

const BLOCKED_PATHS = [
  'public/admin/',
  'tina/__generated__/',
  '.env',
  '.env.local',
  'content-source/',
  'node_modules/',
  '.next/',
];

const ALLOWED_STAGE_PREFIXES = ['src/content/blog/', 'public/images/blog/'];

function asString(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function asDateValue(value) {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  return '';
}

function parseStatus(value) {
  return value === 'published' ? 'published' : 'draft';
}

function isArticleFilename(filename) {
  if (!filename.endsWith('.md')) {
    return false;
  }
  if (filename.startsWith('_')) {
    return false;
  }
  return filename.toLowerCase() !== 'readme.md';
}

function isSafeSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug);
}

function normalizeRepoPath(filePath) {
  return String(filePath || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^"(.*)"$/, '$1');
}

function isAllowedBlogPath(filePath) {
  const normalized = normalizeRepoPath(filePath);
  return ALLOWED_STAGE_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function isBlockedPath(filePath) {
  const normalized = normalizeRepoPath(filePath);
  return BLOCKED_PATHS.some((blocked) => {
    if (blocked.endsWith('/')) {
      return normalized === blocked.slice(0, -1) || normalized.startsWith(blocked);
    }
    return normalized === blocked || normalized.startsWith(`${blocked}/`);
  });
}

function isPublishableArticlePath(filePath) {
  const normalized = normalizeRepoPath(filePath);
  if (!normalized.startsWith('src/content/blog/') || !normalized.endsWith('.md')) {
    return false;
  }
  return isArticleFilename(path.posix.basename(normalized));
}

function publicPathFromImage(image) {
  if (!image.startsWith('/') || image.startsWith('//')) {
    return null;
  }
  return path.join(ROOT, 'public', image.replace(/\//g, path.sep));
}

function preferredImagePath(slug) {
  return `${PREFERRED_IMAGE_PREFIX}${slug}.webp`;
}

function isRasterImage(image) {
  return /\.(png|jpe?g)$/i.test(image);
}

function looksTemporaryFilename(image) {
  const base = path.basename(image);
  return /chatgpt-image|screenshot|untitled|img[-_]\d+/i.test(base);
}

function needsImageCleanup(image, slug) {
  if (image === preferredImagePath(slug)) {
    return false;
  }
  return isRasterImage(image) || looksTemporaryFilename(image);
}

function emptyChangeSet() {
  return {
    added: [],
    modified: [],
    deleted: [],
    renamed: [],
  };
}

function sortUnique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function parsePorcelainLine(line) {
  if (!line) {
    return null;
  }

  const xy = line.slice(0, 2);
  const rest = line.slice(3);
  if (!rest) {
    return null;
  }

  if (rest.includes(' -> ')) {
    const [fromRaw, toRaw] = rest.split(' -> ');
    return {
      xy,
      path: normalizeRepoPath(toRaw),
      from: normalizeRepoPath(fromRaw),
      renamed: true,
    };
  }

  return {
    xy,
    path: normalizeRepoPath(rest),
    from: '',
    renamed: false,
  };
}

function classifyPorcelainEntry(entry, changes) {
  if (!entry) {
    return;
  }

  if (entry.renamed || entry.xy.includes('R')) {
    changes.renamed.push({ from: entry.from, to: entry.path });
    return;
  }

  if (entry.xy === '??' || entry.xy.includes('A')) {
    changes.added.push(entry.path);
    return;
  }

  if (entry.xy.includes('D')) {
    changes.deleted.push(entry.path);
    return;
  }

  changes.modified.push(entry.path);
}

function hasBlogChanges(changes) {
  return (
    changes.added.length > 0 ||
    changes.modified.length > 0 ||
    changes.deleted.length > 0 ||
    changes.renamed.length > 0
  );
}

function changePaths(changes) {
  return sortUnique([
    ...changes.added,
    ...changes.modified,
    ...changes.deleted,
    ...changes.renamed.flatMap((item) => [item.from, item.to]),
  ]);
}

function runGit(args, options = {}) {
  return spawnSync('git', args, {
    cwd: ROOT,
    encoding: options.encoding || 'utf8',
    stdio: options.stdio || 'pipe',
    shell: false,
  });
}

function gitStdout(args) {
  const result = runGit(args);
  if (result.status !== 0) {
    const detail = String(result.stderr || result.stdout || '').trim();
    throw Object.assign(new Error(`git ${args[0]} failed${detail ? `:\n${detail}` : '.'}`), {
      step: `git ${args[0]}`,
    });
  }
  return result.stdout || '';
}

function runGitCommand(args, label) {
  console.log(`\n→ ${label}`);
  const result = runGit(args, { stdio: 'inherit', encoding: 'utf8' });
  if (result.status !== 0) {
    throw Object.assign(new Error(`${label} failed with exit code ${result.status ?? 1}.`), {
      step: label,
    });
  }
}

function npmScriptCommand(args) {
  const script = args[0] === 'run' ? args[1] : args[0];
  const extra = args[0] === 'run' ? args.slice(2).filter((part) => part !== '--') : args.slice(1);

  if (script === 'lint') {
    return [
      process.execPath,
      [path.join(ROOT, 'node_modules', 'eslint', 'bin', 'eslint.js'), ...extra],
    ];
  }

  if (script === 'build') {
    return [process.execPath, [path.join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next'), 'build', ...extra]];
  }

  throw new Error(`Unsupported npm script: ${script}`);
}

function runNpm(args, label) {
  const [command, commandArgs] = npmScriptCommand(args);
  console.log(`\n→ ${label}`);
  const result = spawnSync(command, commandArgs, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    throw Object.assign(new Error(`${label} failed with exit code ${result.status ?? 1}.`), {
      step: label,
    });
  }
}

function gitCommitArgs(message) {
  if (typeof message !== 'string' || !message.trim()) {
    throw new Error('Commit message must be a non-empty string.');
  }

  return ['commit', '-m', message, '--', ...BLOG_GIT_PATHS];
}

function assertCommitMessageIsSingleArg(message) {
  const args = gitCommitArgs(message);
  const messageArg = args[2];

  if (args[0] !== 'commit' || args[1] !== '-m') {
    throw new Error('Git commit argv is malformed.');
  }

  if (messageArg !== message) {
    throw new Error(`Commit message was split or mutated: ${JSON.stringify(args)}`);
  }

  if (args.indexOf(message) !== 2 || args.lastIndexOf(message) !== 2) {
    throw new Error('Commit message must appear exactly once as a single argument.');
  }

  return args;
}

function getPorcelainChanges(gitPaths) {
  const changes = emptyChangeSet();
  const args =
    gitPaths.length > 0
      ? ['status', '--porcelain', '--', ...gitPaths]
      : ['status', '--porcelain'];
  const stdout = gitStdout(args);

  for (const line of stdout.split(/\r?\n/)) {
    classifyPorcelainEntry(parsePorcelainLine(line), changes);
  }

  changes.added = sortUnique(changes.added);
  changes.modified = sortUnique(changes.modified);
  changes.deleted = sortUnique(changes.deleted);
  changes.renamed.sort((a, b) => a.to.localeCompare(b.to));
  return changes;
}

function getBlogGitChanges() {
  return getPorcelainChanges(BLOG_GIT_PATHS);
}

function getUnrelatedChanges() {
  const changes = getPorcelainChanges([]);
  const filterList = (files) => files.filter((file) => !isAllowedBlogPath(file));
  return {
    added: filterList(changes.added),
    modified: filterList(changes.modified),
    deleted: filterList(changes.deleted),
    renamed: changes.renamed.filter((item) => !isAllowedBlogPath(item.to) || !isAllowedBlogPath(item.from)),
  };
}

function mergeProposedConversions(changes, conversions) {
  const next = {
    added: [...changes.added],
    modified: [...changes.modified],
    deleted: [...changes.deleted],
    renamed: [...changes.renamed],
  };

  for (const item of conversions) {
    const articlePath = `src/content/blog/${item.slug}.md`;
    const imagePath = `public/images/blog/${path.basename(item.to)}`;

    if (!next.added.includes(articlePath) && !next.modified.includes(articlePath)) {
      next.modified.push(articlePath);
    }

    if (!next.added.includes(imagePath) && !next.modified.includes(imagePath)) {
      next.added.push(imagePath);
    }
  }

  next.added = sortUnique(next.added);
  next.modified = sortUnique(next.modified);
  return next;
}

function printChangeGroups(changes) {
  console.log('\nAdded:');
  if (changes.added.length === 0) {
    console.log('- none');
  } else {
    for (const file of changes.added) {
      console.log(`+ ${file}`);
    }
  }

  console.log('\nModified:');
  if (changes.modified.length === 0) {
    console.log('- none');
  } else {
    for (const file of changes.modified) {
      console.log(`M ${file}`);
    }
  }

  console.log('\nDeleted:');
  if (changes.deleted.length === 0) {
    console.log('- none');
  } else {
    for (const file of changes.deleted) {
      console.log(`D ${file}`);
    }
  }

  if (changes.renamed.length > 0) {
    console.log('\nRenamed:');
    for (const item of changes.renamed) {
      console.log(`R ${item.from} -> ${item.to}`);
    }
  }
}

function printUnrelatedWarning(unrelated) {
  if (!hasBlogChanges(unrelated)) {
    return;
  }

  console.log('\nUnrelated changes that will NOT be staged:');
  for (const file of unrelated.added) console.log(`+ ${file}`);
  for (const file of unrelated.modified) console.log(`M ${file}`);
  for (const file of unrelated.deleted) console.log(`D ${file}`);
  for (const item of unrelated.renamed) console.log(`R ${item.from} -> ${item.to}`);
}

function readArticles() {
  if (!fs.existsSync(BLOG_DIR)) {
    throw new Error(`Missing blog directory: ${BLOG_DIR}`);
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter(isArticleFilename)
    .map((filename) => {
      const filePath = path.join(BLOG_DIR, filename);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(raw);
      const slug = filename.replace(/\.md$/i, '');
      return {
        filename,
        filePath,
        raw,
        slug,
        title: asString(data.title, slug),
        seoTitle: asString(data.seoTitle),
        description: asString(data.description),
        date: asDateValue(data.date),
        category: asString(data.category),
        image: asString(data.image),
        author: asString(data.author),
        status: parseStatus(data.status),
        primaryKeyword: asString(data.primaryKeyword),
        body: asString(content),
      };
    });
}

function collectImageReferences(articles) {
  const refs = new Map();
  for (const article of articles) {
    if (!article.image) {
      continue;
    }
    const abs = publicPathFromImage(article.image);
    if (!abs) {
      continue;
    }
    const key = path.normalize(abs);
    if (!refs.has(key)) {
      refs.set(key, []);
    }
    refs.get(key).push(article.slug);
  }
  return refs;
}

function replaceImageLine(raw, nextImage) {
  if (!/^image:\s*.+$/m.test(raw)) {
    throw new Error('Article is missing an image frontmatter line.');
  }
  return raw.replace(/^image:\s*.+$/m, `image: "${nextImage}"`);
}

async function convertToWebp(sourcePath, destPath) {
  const metadata = await sharp(sourcePath).metadata();
  let pipeline = sharp(sourcePath);

  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
    });
  }

  await pipeline.webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(destPath);

  if (!fs.existsSync(destPath) || fs.statSync(destPath).size < 1000) {
    throw new Error(`WebP was not created successfully: ${destPath}`);
  }
}

function assertSafeGitState() {
  const trackedBlocked = gitStdout(['ls-files', '--', ...BLOCKED_PATHS])
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (trackedBlocked.length > 0) {
    throw Object.assign(
      new Error(`Blocked paths are tracked by Git. STOPPING.\n${trackedBlocked.join('\n')}`),
      { step: 'Safety check' }
    );
  }

  const stagedBlocked = gitStdout(['diff', '--cached', '--name-only', '--', ...BLOCKED_PATHS])
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (stagedBlocked.length > 0) {
    throw Object.assign(
      new Error(`Blocked paths are already staged. STOPPING.\n${stagedBlocked.join('\n')}`),
      { step: 'Safety check' }
    );
  }
}

function stagedNames() {
  return gitStdout(['diff', '--cached', '--name-only'])
    .split(/\r?\n/)
    .map((line) => normalizeRepoPath(line))
    .filter(Boolean);
}

function assertStagedFilesAreAllowed(stagedFiles) {
  const unexpected = stagedFiles.filter((file) => !isAllowedBlogPath(file) || isBlockedPath(file));

  if (unexpected.length > 0) {
    throw Object.assign(
      new Error(`Refusing to continue. Unexpected files were staged:\n${unexpected.join('\n')}`),
      { step: 'Stage blog files only' }
    );
  }
}

function validateArticles(published) {
  const errors = [];
  const slugs = published.map((article) => article.slug);
  const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);

  if (duplicateSlugs.length > 0) {
    errors.push(`Duplicate slugs: ${[...new Set(duplicateSlugs)].join(', ')}`);
  }

  for (const article of published) {
    if (article.status !== 'published') {
      errors.push(`${article.slug} is not published.`);
    }
    if (!isSafeSlug(article.slug)) {
      errors.push(`${article.filename} does not have a safe slug.`);
    }
    if (!article.title) errors.push(`${article.slug} is missing title.`);
    if (!article.seoTitle) errors.push(`${article.slug} is missing seoTitle.`);
    if (!article.description) errors.push(`${article.slug} is missing description.`);
    if (!article.date) errors.push(`${article.slug} is missing date.`);
    if (!article.category) errors.push(`${article.slug} is missing category.`);
    if (!article.author) errors.push(`${article.slug} is missing author.`);
    if (!article.primaryKeyword) errors.push(`${article.slug} is missing primaryKeyword.`);
    if (!article.body) errors.push(`${article.slug} is missing body content.`);
    if (!article.image) {
      errors.push(`${article.slug} is missing image.`);
      continue;
    }

    const abs = publicPathFromImage(article.image);
    if (!abs || !fs.existsSync(abs)) {
      errors.push(`${article.slug} references a missing image: ${article.image}`);
    }
  }

  if (errors.length > 0) {
    throw Object.assign(new Error(`Blog validation failed:\n- ${errors.join('\n- ')}`), {
      step: 'Validation',
    });
  }
}

function printDetectedChanges(changes, conversions, baseline) {
  console.log('\nBLOG CHANGES DETECTED');
  printChangeGroups(changes);

  if (baseline && hasBlogChanges(baseline)) {
    console.log('\nThese include intentional Tina/local blog changes that were already present when publish started.');
  }

  if (conversions.length > 0) {
    console.log('\nImage cleanup from this publish run:');
    for (const item of conversions) {
      console.log(
        `- ${item.slug}: ${item.from} → ${item.to}${item.dryRun ? ' (proposed, not written)' : ''}`
      );
    }
  }
}

function printSummary({ published, drafts, conversions, lintPass, buildPass, changes, commitMessage }) {
  console.log('\n====================================');
  console.log('BLOGS READY TO PUBLISH');
  console.log('====================================\n');

  console.log('Published articles:');
  for (const article of published) {
    console.log(`- ${article.slug}`);
  }

  console.log('\nDrafts ignored:');
  if (drafts.length === 0) {
    console.log('- none');
  } else {
    for (const article of drafts) {
      console.log(`- ${article.slug}`);
    }
  }

  console.log('\nBlog file changes:');
  printChangeGroups(changes);

  if (conversions.length > 0) {
    console.log('\nImage cleanup:');
    for (const item of conversions) {
      console.log(
        `- ${item.slug}: ${item.from} → ${item.to}${item.dryRun ? ' (proposed, not written)' : ''}`
      );
    }
  }

  console.log(`\nLint: ${lintPass ? 'PASS' : 'FAIL'}`);
  console.log(`Build: ${buildPass ? 'PASS' : 'FAIL'}`);

  if (commitMessage) {
    const args = assertCommitMessageIsSingleArg(commitMessage);
    console.log('\nCommit message:');
    console.log(commitMessage);
    console.log('\nGit commit argv (spawnSync, shell: false):');
    console.log(JSON.stringify(['git', ...args]));
    console.log('Commit message argument count: 1');
  }

  if (DRY_RUN) {
    console.log('\nDRY RUN: no files were staged, committed, or pushed.');
    console.log('DRY RUN: article files and images were not permanently modified.');
  }

  console.log('\n====================================');
}

async function processImages(published, allArticles) {
  const conversions = [];
  const refs = collectImageReferences(allArticles);

  for (const article of published) {
    const preferred = preferredImagePath(article.slug);
    if (!needsImageCleanup(article.image, article.slug)) {
      continue;
    }

    const sourceAbs = publicPathFromImage(article.image);
    if (!sourceAbs || !fs.existsSync(sourceAbs)) {
      throw Object.assign(new Error(`${article.slug} image does not exist: ${article.image}`), {
        step: 'Image conversion',
      });
    }

    const destAbs = publicPathFromImage(preferred);
    conversions.push({
      slug: article.slug,
      from: article.image,
      to: preferred,
      sourceAbs,
      destAbs,
      dryRun: DRY_RUN,
    });

    if (DRY_RUN) {
      continue;
    }

    fs.mkdirSync(IMAGE_DIR, { recursive: true });
    await convertToWebp(sourceAbs, destAbs);

    const nextRaw = replaceImageLine(article.raw, preferred);
    if (nextRaw !== article.raw) {
      fs.writeFileSync(article.filePath, nextRaw, 'utf8');
      article.raw = nextRaw;
    }
    article.image = preferred;

    const oldKey = path.normalize(sourceAbs);
    const remaining = (refs.get(oldKey) || []).filter((slug) => slug !== article.slug);
    if (remaining.length === 0 && oldKey !== path.normalize(destAbs)) {
      fs.unlinkSync(sourceAbs);
    }
  }

  return conversions;
}

async function confirm(question) {
  const rl = readline.createInterface({ input, output });
  const answer = (await rl.question(`\n${question} `)).trim().toLowerCase();
  rl.close();
  return answer === 'y' || answer === 'yes';
}

function buildCommitMessage(changes) {
  const addedArticles = changes.added.filter(isPublishableArticlePath);
  const otherArticleChanges =
    changes.modified.some(isPublishableArticlePath) ||
    changes.deleted.some(isPublishableArticlePath) ||
    changes.renamed.some((item) => isPublishableArticlePath(item.from) || isPublishableArticlePath(item.to));

  if (addedArticles.length === 1 && !otherArticleChanges) {
    return `Publish blog: ${path.posix.basename(addedArticles[0], '.md')}`;
  }

  return 'Publish blog updates';
}

function testCommitMessageConstruction() {
  const samples = [
    'Publish blog updates',
    'Publish blog: clinical-psychologist-in-lahore',
    'Publish "Anxiety & Depression" article',
  ];

  for (const message of samples) {
    assertCommitMessageIsSingleArg(message);
  }

  const sampleLine = parsePorcelainLine('M  src/content/blog/couples-therapy-lahore.md');
  if (!sampleLine || sampleLine.path !== 'src/content/blog/couples-therapy-lahore.md') {
    throw new Error('Porcelain modified-file parsing failed.');
  }

  console.log('\nCommit-message argument construction: PASS');
  console.log('Verified single-argument messages:');
  for (const message of samples) {
    console.log(`- ${JSON.stringify(message)}`);
  }
}

function reportCommitFailure() {
  console.log('\n→ git status');
  runGit(['status'], { stdio: 'inherit' });

  const staged = stagedNames();
  console.log('\nExactly what remains staged:');
  if (staged.length === 0) {
    console.log('- none');
    return;
  }

  for (const file of staged) {
    console.log(`- ${file}`);
  }
}

async function main() {
  console.log(DRY_RUN ? 'Blog publish dry-run starting…' : 'Blog publish starting…');

  const baseline = getBlogGitChanges();
  const unrelated = getUnrelatedChanges();

  const allArticles = readArticles();
  const published = allArticles.filter((article) => article.status === 'published');
  const drafts = allArticles.filter((article) => article.status !== 'published');

  if (published.length === 0) {
    throw Object.assign(new Error('No published articles found. Drafts were ignored.'), {
      step: 'Validation',
    });
  }

  const conversions = await processImages(published, allArticles);
  const refreshed = readArticles();
  const publishedAfter = refreshed.filter((article) => article.status === 'published');
  const draftsAfter = refreshed.filter((article) => article.status !== 'published');

  validateArticles(publishedAfter);

  let changes = getBlogGitChanges();
  if (DRY_RUN && conversions.length > 0) {
    changes = mergeProposedConversions(changes, conversions);
  }

  printDetectedChanges(changes, conversions, baseline);
  printUnrelatedWarning(unrelated);

  if (hasBlogChanges(changes) && !DRY_RUN) {
    const continueConfirmed = await confirm('Continue with these blog changes? (y/N)');
    if (!continueConfirmed) {
      console.log('Cancelled. No files were staged, committed, or pushed.');
      return;
    }
  }

  let lintPass = false;
  let buildPass = false;

  runNpm(['run', 'lint', '--', '--quiet'], 'Lint');
  lintPass = true;
  runNpm(['run', 'build'], 'Production build');
  buildPass = true;

  const message = hasBlogChanges(changes) ? buildCommitMessage(changes) : '';

  printSummary({
    published: publishedAfter,
    drafts: draftsAfter,
    conversions,
    lintPass,
    buildPass,
    changes,
    commitMessage: message || 'Publish blog updates',
  });

  if (DRY_RUN) {
    testCommitMessageConstruction();
    return;
  }

  if (!hasBlogChanges(changes)) {
    console.log('\nNothing new to commit. Live site is already up to date for blog files.');
    return;
  }

  const publishConfirmed = await confirm('Publish these blog changes to the live website? (y/N)');
  if (!publishConfirmed) {
    console.log('Cancelled. No files were staged, committed, or pushed.');
    return;
  }

  const branch = gitStdout(['rev-parse', '--abbrev-ref', 'HEAD']).trim();
  if (branch !== 'main') {
    throw Object.assign(new Error(`Refusing to push from branch "${branch}". Switch to main first.`), {
      step: 'Branch check',
    });
  }

  assertSafeGitState();
  runGitCommand(['add', '-A', '--', ...BLOG_GIT_PATHS], 'Stage blog files only');

  const stagedFiles = stagedNames().filter(isAllowedBlogPath);
  const stagedUnexpected = stagedNames().filter((file) => !isAllowedBlogPath(file));
  if (stagedUnexpected.length > 0) {
    console.log('\nWarning: unrelated files were already staged and were left untouched:');
    for (const file of stagedUnexpected) {
      console.log(`- ${file}`);
    }
  }

  assertStagedFilesAreAllowed(stagedFiles);

  if (stagedFiles.length === 0) {
    console.log('\nNothing new to commit after staging blog paths.');
    return;
  }

  const commitArgs = assertCommitMessageIsSingleArg(buildCommitMessage(changes));
  try {
    runGitCommand(commitArgs, 'Commit blog updates');
  } catch (error) {
    reportCommitFailure();
    throw error;
  }

  try {
    runGitCommand(['push', 'origin', 'main'], 'Push to origin/main');
  } catch (error) {
    console.error('\nPush failed. The local commit was kept.');
    console.error('Nothing was reset.');
    throw error;
  }

  console.log('\nBlog changes pushed successfully.');
  console.log('Vercel deployment should now start automatically.');
}

main().catch((error) => {
  console.error(`\nPublish stopped at: ${error.step || 'publish'}`);
  console.error(error.message);
  process.exit(1);
});
