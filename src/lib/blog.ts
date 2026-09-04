import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const SITE_URL = 'https://www.ambreenrashidkhan.com';
export const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

export type BlogPostStatus = 'draft' | 'published';

export type BlogPost = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  date: string;
  category: string;
  image: string;
  author: string;
  status: BlogPostStatus;
  primaryKeyword: string;
  content: string;
  readingTime: number;
  hasImage: boolean;
};

type BlogListOptions = {
  includeDrafts?: boolean;
};

const WORDS_PER_MINUTE = 200;

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function parseStatus(value: unknown): BlogPostStatus {
  return value === 'published' ? 'published' : 'draft';
}

export function calculateReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function formatPostDate(date: string): string {
  const parts = date.split('-').map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return date;
  }

  const [year, month, day] = parts;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatReadingTime(readingTime: number): string {
  return `${readingTime} min read`;
}

export function blogImageExists(image: string): boolean {
  if (!image.startsWith('/') || image.startsWith('//')) {
    return false;
  }

  const publicPath = path.join(process.cwd(), 'public', image);
  return fs.existsSync(publicPath);
}

function isArticleFilename(filename: string): boolean {
  if (!filename.endsWith('.md')) {
    return false;
  }

  if (filename.startsWith('_')) {
    return false;
  }

  return filename.toLowerCase() !== 'readme.md';
}

function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug);
}

function parsePostFile(filePath: string, filename: string): BlogPost {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.md$/i, '');
  const title = asString(data.title, slug);
  const image = asString(data.image);

  return {
    slug,
    title,
    seoTitle: asString(data.seoTitle, title),
    description: asString(data.description),
    date: asString(data.date),
    category: asString(data.category),
    image,
    author: asString(data.author, 'Ambreen Rashid Khan'),
    status: parseStatus(data.status),
    primaryKeyword: asString(data.primaryKeyword),
    content,
    readingTime: calculateReadingTime(content),
    hasImage: Boolean(image) && blogImageExists(image),
  };
}

function readAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter(isArticleFilename)
    .map((filename) => parsePostFile(path.join(BLOG_DIR, filename), filename));
}

function sortNewestFirst(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const aTime = Date.parse(a.date);
    const bTime = Date.parse(b.date);
    const safeA = Number.isNaN(aTime) ? 0 : aTime;
    const safeB = Number.isNaN(bTime) ? 0 : bTime;
    return safeB - safeA;
  });
}

export function getAllPosts(options: BlogListOptions = {}): BlogPost[] {
  const posts = readAllPosts();
  const visible = options.includeDrafts
    ? posts
    : posts.filter((post) => post.status === 'published');

  return sortNewestFirst(visible);
}

export function getAllPostSlugs(options: BlogListOptions = {}): string[] {
  return getAllPosts(options).map((post) => post.slug);
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!isSafeSlug(slug)) {
    return null;
  }

  const filename = `${slug}.md`;
  if (!isArticleFilename(filename)) {
    return null;
  }

  const filePath = path.join(BLOG_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parsePostFile(filePath, filename);
}
