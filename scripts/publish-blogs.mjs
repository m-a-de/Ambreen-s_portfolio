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
      const { data } = matter(raw);
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

function runCommand(command, args, label) {
  console.log(`\n→ ${label}`);
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status ?? 1}.`);
  }
}

function gitLines(args) {
  const result = spawnSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed.`);
  }

  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function assertSafeGitState() {
  const trackedBlocked = gitLines(['ls-files', '--', ...BLOCKED_PATHS]);
  if (trackedBlocked.length > 0) {
    throw new Error(
      `Blocked paths are tracked by Git. STOPPING.\n${trackedBlocked.join('\n')}`
    );
  }

  const stagedBlocked = gitLines(['diff', '--cached', '--name-only', '--', ...BLOCKED_PATHS]);
  if (stagedBlocked.length > 0) {
    throw new Error(
      `Blocked paths are already staged. STOPPING.\n${stagedBlocked.join('\n')}`
    );
  }
}

function assertStagedFilesAreAllowed(stagedFiles) {
  const unexpected = stagedFiles.filter(
    (file) => !ALLOWED_STAGE_PREFIXES.some((prefix) => file.replace(/\\/g, '/').startsWith(prefix))
  );

  if (unexpected.length > 0) {
    spawnSync('git', ['reset', 'HEAD', '--', ...unexpected], {
      cwd: ROOT,
      shell: process.platform === 'win32',
    });
    throw new Error(
      `Refusing to continue. Unexpected files were staged:\n${unexpected.join('\n')}`
    );
  }
}

function validateArticles(published, drafts, allArticles) {
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
    throw new Error(`Blog validation failed:\n- ${errors.join('\n- ')}`);
  }

  return { published, drafts, allArticles };
}

function printSummary({
  published,
  drafts,
  conversions,
  lintPass,
  buildPass,
  gitFiles,
}) {
  console.log('\n========================================');
  console.log('BLOGS READY TO PUBLISH');
  console.log('========================================\n');

  console.log('Published:');
  for (const article of published) {
    console.log(`- ${article.slug}`);
  }

  console.log('\nImages:');
  for (const article of published) {
    console.log(`- ${path.basename(article.image)}`);
  }

  if (conversions.length > 0) {
    console.log('\nImage cleanup:');
    for (const item of conversions) {
      console.log(
        `- ${item.slug}: ${item.from} → ${item.to}${item.dryRun ? ' (proposed)' : ''}`
      );
    }
  }

  console.log('\nDrafts ignored:');
  if (drafts.length === 0) {
    console.log('- none');
  } else {
    for (const article of drafts) {
      console.log(`- ${article.slug}`);
    }
  }

  console.log(`\nLint: ${lintPass ? 'PASS' : 'FAIL'}`);
  console.log(`Build: ${buildPass ? 'PASS' : 'FAIL'}`);

  console.log('\nGit files to commit:');
  if (gitFiles.length === 0) {
    console.log('- none');
  } else {
    for (const file of gitFiles) {
      console.log(`- ${file}`);
    }
  }

  if (DRY_RUN) {
    console.log('\nDRY RUN: no files were changed, committed, or pushed.');
  }
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
      throw new Error(`${article.slug} image does not exist: ${article.image}`);
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

function filesThatWouldBeStaged(conversions) {
  const current = gitLines(['status', '--short', '--', 'src/content/blog', 'public/images/blog']);
  const proposed = [];

  for (const item of conversions) {
    proposed.push(`public/images/blog/${path.basename(item.to)}`);
    proposed.push(`src/content/blog/${item.slug}.md`);
  }

  return [...new Set([...current, ...proposed])];
}

async function confirmPublish() {
  const rl = readline.createInterface({ input, output });
  const answer = (await rl.question('\nPublish these blog changes to the live website? (y/N) '))
    .trim()
    .toLowerCase();
  rl.close();
  return answer === 'y' || answer === 'yes';
}

function commitMessage(stagedFiles) {
  const slugs = stagedFiles
    .filter((file) => file.replace(/\\/g, '/').startsWith('src/content/blog/'))
    .map((file) => path.basename(file, '.md'))
    .filter((slug) => slug !== 'README' && !slug.startsWith('_'));

  if (slugs.length === 1) {
    return `Publish blog: ${slugs[0]}`;
  }
  return 'Publish blog updates';
}

async function main() {
  console.log(DRY_RUN ? 'Blog publish dry-run starting…' : 'Blog publish starting…');

  const allArticles = readArticles();
  const published = allArticles.filter((article) => article.status === 'published');
  const drafts = allArticles.filter((article) => article.status !== 'published');

  if (published.length === 0) {
    throw new Error('No published articles found. Drafts were ignored.');
  }

  const conversions = await processImages(published, allArticles);
  const refreshed = readArticles();
  const publishedAfter = refreshed.filter((article) => article.status === 'published');
  const draftsAfter = refreshed.filter((article) => article.status !== 'published');

  validateArticles(publishedAfter, draftsAfter, refreshed);

  let lintPass = false;
  let buildPass = false;

  runCommand('npm', ['run', 'lint', '--', '--quiet'], 'Lint');
  lintPass = true;
  runCommand('npm', ['run', 'build'], 'Production build');
  buildPass = true;

  if (DRY_RUN) {
    printSummary({
      published: publishedAfter,
      drafts: draftsAfter,
      conversions,
      lintPass,
      buildPass,
      gitFiles: filesThatWouldBeStaged(conversions),
    });
    return;
  }

  assertSafeGitState();
  runCommand('git', ['add', '--', 'src/content/blog', 'public/images/blog'], 'Stage blog files only');

  const stagedFiles = gitLines(['diff', '--cached', '--name-only']);
  assertStagedFilesAreAllowed(stagedFiles);
  assertSafeGitState();

  printSummary({
    published: publishedAfter,
    drafts: draftsAfter,
    conversions,
    lintPass,
    buildPass,
    gitFiles: stagedFiles,
  });

  if (stagedFiles.length === 0) {
    console.log('\nNothing new to commit. Live site is already up to date for blog files.');
    return;
  }

  const confirmed = await confirmPublish();
  if (!confirmed) {
    spawnSync('git', ['reset', 'HEAD', '--', 'src/content/blog', 'public/images/blog'], {
      cwd: ROOT,
      shell: process.platform === 'win32',
    });
    console.log('Cancelled. No commit or push was made.');
    return;
  }

  const branch = gitLines(['rev-parse', '--abbrev-ref', 'HEAD'])[0];
  if (branch !== 'main') {
    throw new Error(`Refusing to push from branch "${branch}". Switch to main first.`);
  }

  runCommand('git', ['commit', '-m', commitMessage(stagedFiles)], 'Commit blog updates');
  runCommand('git', ['push', 'origin', 'main'], 'Push to origin/main');

  console.log('\nBlog changes pushed successfully.');
  console.log('Vercel deployment should now start automatically.');
}

main().catch((error) => {
  console.error(`\nPublish stopped: ${error.message}`);
  process.exit(1);
});
