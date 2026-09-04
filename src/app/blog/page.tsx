import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BlogCoverImage from '@/components/BlogCoverImage';
import { formatPostDate, formatReadingTime, getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Insights & Resources | Ambreen Rashid Khan',
  description:
    'Mental health, relationships, therapy and personal growth resources from Ambreen Rashid Khan, Clinical Psychologist in Lahore.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFCF7]">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-[#FBF8F1] py-16 md:py-20">
          <div className="mx-auto max-w-[800px] px-5 text-center sm:px-6 lg:px-8">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
              Blog / Insights
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-[#123F38] md:text-5xl">
              Insights &amp; Resources
            </h1>
            <p className="mt-4 font-serif text-lg text-[#064F45] md:text-xl">
              Mental Health, Relationships &amp; Personal Growth
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
              Thoughtful resources on emotional well-being, relationships, therapy, and personal
              growth from Ambreen Rashid Khan.
            </p>
          </div>
        </section>

        <section className="bg-[#FFFCF7] py-16 md:py-20">
          <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
            {posts.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E8DED1] bg-[#FBF8F1]">
                      <BlogCoverImage
                        src={post.image}
                        alt=""
                        hasImage={post.hasImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-48 w-full"
                      />
                      <div className="flex flex-1 flex-col p-6">
                        {post.category && (
                          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#C8A675] uppercase">
                            {post.category}
                          </p>
                        )}
                        <h2 className="mt-3 font-serif text-xl font-semibold text-[#123F38]">
                          <Link href={`/blog/${post.slug}`} className="hover:text-[#064F45]">
                            {post.title}
                          </Link>
                        </h2>
                        {post.description && (
                          <p className="mt-3 text-sm leading-relaxed text-[#525B57]">
                            {post.description}
                          </p>
                        )}
                        <p className="mt-4 text-xs tracking-wide text-[#525B57]">
                          {formatPostDate(post.date)}
                          <span className="mx-2 text-[#C8A675]" aria-hidden="true">
                            ·
                          </span>
                          {formatReadingTime(post.readingTime)}
                        </p>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="mt-5 inline-flex text-[13px] font-semibold text-[#064F45] transition-colors hover:text-[#05443B]"
                        >
                          Read Article
                        </Link>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mx-auto max-w-2xl rounded-xl border border-[#E8DED1] bg-[#FBF8F1] px-6 py-14 text-center md:px-10">
                <p className="font-serif text-2xl font-semibold text-[#123F38]">
                  New articles are coming soon.
                </p>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#525B57]">
                  Resources on mental health, relationships, emotional well-being and personal growth
                  will be added here.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 min-[400px]:flex-row">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center justify-center rounded-md bg-[#064F45] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#05443B]"
                  >
                    Book a Session
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-md border border-[#064F45] bg-[#FFFCF7] px-5 py-2.5 text-[13px] font-semibold text-[#064F45] transition-colors hover:bg-[#EEF5EF]"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
