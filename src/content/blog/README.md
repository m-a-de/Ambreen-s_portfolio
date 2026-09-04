# Blog maintenance

Each public article is one Markdown file in this folder.

The filename becomes the URL slug:

`my-article-title.md` → `/blog/my-article-title`

Files that start with `_` and `README.md` are ignored by the blog loader.

Reading time is calculated automatically from the article body at 200 words per minute. Do not add `readTime` to frontmatter.

---

## ADD BLOG

1. Copy `_TEMPLATE.md`.
2. Rename the copy to the desired slug, for example `understanding-anxiety.md`.
3. Update the frontmatter.
4. Add the article content below the frontmatter.
5. Add the image to `public/images/blog/` and set `image` to `/images/blog/your-file.webp`.
6. Set `status` to `"draft"` or `"published"`.
7. Build/deploy.

---

## EDIT BLOG

Edit the corresponding `.md` file.

---

## PUBLISH

Change:

```yaml
status: "draft"
```

to:

```yaml
status: "published"
```

No other code changes are required.

---

## UNPUBLISH

Change:

```yaml
status: "published"
```

to:

```yaml
status: "draft"
```

Draft posts do not appear on `/blog`, in the sitemap, or as public article URLs.

---

## DELETE

Delete the `.md` file and optionally its image in `public/images/blog/`.

---

## Frontmatter

```yaml
---
title: "Article Title"
seoTitle: "SEO Title"
description: "Meta description"
date: "2026-09-04"
category: "Category"
image: "/images/blog/example.webp"
author: "Ambreen Rashid Khan"
status: "draft"
primaryKeyword: "keyword"
---
```

Internal links to other posts must use `/blog/{slug}`.
