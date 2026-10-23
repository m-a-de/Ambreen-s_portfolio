import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ContactSection from '@/components/ContactSection';
import BlogCoverImage from '@/components/BlogCoverImage';
import BookSessionLink from '@/components/BookSessionLink';
import {
  SITE_URL,
  formatPostDate,
  formatReadingTime,
  getAllPosts,
  getAllPostSlugs,
  getPostBySlug,
  type BlogPost,
} from '@/lib/blog';

function getRelatedPosts(current: BlogPost, limit = 3): BlogPost[] {
  const others = getAllPosts().filter((post) => post.slug !== current.slug);
  const currentCategory = current.category.trim().toLowerCase();
  const sameCategory = currentCategory
    ? others.filter((post) => post.category.trim().toLowerCase() === currentCategory)
    : [];
  const otherCategory = others.filter(
    (post) => !currentCategory || post.category.trim().toLowerCase() !== currentCategory
  );

  return [...sameCategory, ...otherCategory].slice(0, limit);
}

function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function toJsonLdDatePublished(date: string): string | undefined {
  const isoDateTimeWithTimezone =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

  if (!isoDateTimeWithTimezone.test(date) || Number.isNaN(Date.parse(date))) {
    return undefined;
  }

  return date;
}

function getArticleJsonLd(post: BlogPost) {
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const authorName = post.author || 'Ambreen Rashid Khan';

  const blogPosting: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: canonical,
    mainEntityOfPage: canonical,
    author: {
      '@type': 'Person',
      name: authorName,
      url: `${SITE_URL}/#about`,
    },
  };

  if (post.description) {
    blogPosting.description = post.description;
  }

  if (post.hasImage) {
    blogPosting.image = `${SITE_URL}${post.image}`;
  }

  const datePublished = toJsonLdDatePublished(post.date);
  if (datePublished) {
    blogPosting.datePublished = datePublished;
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: canonical,
      },
    ],
  };

  return { blogPosting, breadcrumb };
}

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.hasImage ? `${SITE_URL}${post.image}` : undefined;

  return {
    title: post.seoTitle,
    description: post.description,
    authors: [{ name: 'Ambreen Rashid Khan' }],
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'article',
      title: post.seoTitle,
      description: post.description,
      url: canonical,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  const { blogPosting, breadcrumb } = getArticleJsonLd(post);
  const relatedPosts = getRelatedPosts(post);

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFCF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPosting) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />
      <SiteHeader />

      <main className="flex-1">
        <article className="bg-[#FFFCF7] py-16 md:py-20">
          <div className="mx-auto w-full max-w-[800px] px-5 sm:px-6">
            <nav aria-label="Breadcrumb" className="text-sm text-[#525B57]">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="transition-colors hover:text-[#064F45]">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="transition-colors hover:text-[#064F45]">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#123F38]">{post.title}</li>
              </ol>
            </nav>

            {post.category && (
              <p className="mt-8 text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
                {post.category}
              </p>
            )}

            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#123F38] md:text-5xl">
              {post.title}
            </h1>

            <p className="mt-4 text-sm text-[#525B57]">
              {formatPostDate(post.date)}
              <span className="mx-2 text-[#C8A675]" aria-hidden="true">
                ·
              </span>
              {formatReadingTime(post.readingTime)}
            </p>

            <div className="mt-6">
              <p className="font-serif text-lg font-semibold text-[#123F38]">
                <Link href="/#about" className="transition-colors hover:text-[#064F45]">
                  {post.author}
                </Link>
              </p>
              <p className="text-sm text-[#064F45]">Clinical Psychologist</p>
            </div>

            <BlogCoverImage
              src={post.image}
              alt={post.title}
              hasImage={post.hasImage}
              sizes="(max-width: 800px) 100vw, 800px"
              className="mt-8 aspect-[16/9] w-full rounded-xl"
            />

            <div
              className={[
                'mt-10 text-base leading-relaxed text-[#525B57]',
                '[&_p]:mt-5',
                '[&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#123F38]',
                '[&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#123F38]',
                '[&_h4]:mt-6 [&_h4]:font-serif [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#123F38]',
                '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-5',
                '[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-5',
                '[&_li]:mt-2',
                '[&_a]:text-[#064F45] [&_a]:underline [&_a]:underline-offset-2',
                '[&_blockquote]:mt-6 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#064F45] [&_blockquote]:bg-[#FBF8F1] [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:italic',
                '[&_img]:mt-6 [&_img]:rounded-xl',
                '[&_code]:rounded [&_code]:bg-[#F3EADB] [&_code]:px-1.5 [&_code]:py-0.5',
                '[&_pre]:mt-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-[#123F38] [&_pre]:p-4 [&_pre]:text-[#FFFCF7]',
                '[&_hr]:my-10 [&_hr]:border-[#E8DED1]',
                '[&_table]:mt-6 [&_table]:w-full [&_table]:text-sm',
                '[&_th]:border [&_th]:border-[#E8DED1] [&_th]:bg-[#FBF8F1] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left',
                '[&_td]:border [&_td]:border-[#E8DED1] [&_td]:px-3 [&_td]:py-2',
              ].join(' ')}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children }) => {
                    if (href?.startsWith('/')) {
                      return <Link href={href}>{children}</Link>;
                    }

                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            <section
              className="mt-14 rounded-xl border border-[#C8A675]/40 bg-[#FBF8F1] px-6 py-6"
              aria-labelledby="about-the-author-heading"
            >
              <h2
                id="about-the-author-heading"
                className="font-serif text-2xl font-semibold text-[#123F38]"
              >
                About the Author
              </h2>
              <p className="mt-3 font-serif text-xl font-semibold text-[#123F38]">
                Ambreen Rashid Khan
              </p>
              <p className="mt-1 text-sm text-[#064F45]">Clinical Psychologist</p>
              <p className="mt-4 text-sm leading-relaxed text-[#525B57]">
                Ambreen Rashid Khan is a Clinical Psychologist based in Lahore, providing
                psychological support for adults experiencing emotional, behavioural, trauma-related
                and relationship concerns. Her approach incorporates trauma-informed care and
                motivational interviewing, with therapy tailored to each person&apos;s circumstances
                and goals.
              </p>
              <Link
                href="/#about"
                className="mt-4 inline-flex text-[13px] font-semibold text-[#064F45] transition-colors hover:text-[#05443B]"
              >
                Learn more about Ambreen
              </Link>
            </section>

            {relatedPosts.length > 0 && (
              <section className="mt-14" aria-labelledby="related-articles-heading">
                <h2
                  id="related-articles-heading"
                  className="font-serif text-2xl font-semibold text-[#123F38]"
                >
                  Related Articles
                </h2>
                <ul className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {relatedPosts.map((related) => (
                    <li key={related.slug}>
                      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E8DED1] bg-[#FBF8F1]">
                        <BlogCoverImage
                          src={related.image}
                          alt={related.title}
                          hasImage={related.hasImage}
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="h-36 w-full"
                        />
                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="font-serif text-lg font-semibold leading-snug text-[#123F38]">
                            <Link
                              href={`/blog/${related.slug}`}
                              className="transition-colors hover:text-[#064F45]"
                            >
                              {related.title}
                            </Link>
                          </h3>
                          {related.description && (
                            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#525B57]">
                              {related.description}
                            </p>
                          )}
                          <Link
                            href={`/blog/${related.slug}`}
                            className="mt-4 inline-flex text-[13px] font-semibold text-[#064F45] transition-colors hover:text-[#05443B]"
                          >
                            Read Article
                          </Link>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-14 rounded-xl border border-[#E8DED1] bg-[#FBF8F1] px-6 py-8 text-center">
              <p className="font-serif text-2xl font-semibold text-[#123F38]">Need support?</p>
              <BookSessionLink
                href="#contact"
                source="blog_article"
                className="mt-5 inline-flex items-center justify-center rounded-md bg-[#064F45] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#05443B]"
              >
                Book a Session
              </BookSessionLink>
            </div>
          </div>
        </article>

        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
