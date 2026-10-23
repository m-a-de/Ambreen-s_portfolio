import { getAllPosts } from "../lib/blog";

const SITE_URL = "https://www.ambreenrashidkhan.com";

export default function sitemap() {
  const posts = getAllPosts();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}
