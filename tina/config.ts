import React from 'react';
import { defineConfig, LocalAuthProvider, wrapFieldsWithMeta } from 'tinacms';

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.GITHUB_BRANCH ||
  'main';

// Local `tinacms dev` and any non-Vercel machine stay on LocalAuthProvider,
// even if TinaCloud env vars exist in .env. Vercel builds use TinaCloud.
const isLocal =
  process.env.TINA_PUBLIC_IS_LOCAL === 'true' || process.env.VERCEL !== '1';

function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Existing filenames plus reserved names. Used only when creating a new post. */
const RESERVED_BLOG_SLUGS = new Set([
  'psychologist-in-lahore',
  'anxiety-therapy-lahore',
  'depression-therapy-lahore',
  'trauma-therapy-lahore',
  'couples-therapy-lahore',
  'online-therapy-pakistan',
  '_template',
  'readme',
]);

function uniqueSlugFromTitle(title: string) {
  const base = slugifyTitle(title) || 'new-article';
  if (!RESERVED_BLOG_SLUGS.has(base)) {
    return base;
  }

  let suffix = 2;
  while (RESERVED_BLOG_SLUGS.has(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`;
}

function createSeoCountField(recommendedMin: number, recommendedMax: number, multiline = false) {
  return wrapFieldsWithMeta(({ input }) => {
    const value = typeof input.value === 'string' ? input.value : '';
    const count = value.length;
    const inRange = count >= recommendedMin && count <= recommendedMax;
    const { type: _inputType, ...inputProps } = input;

    return React.createElement(
      'div',
      null,
      React.createElement(multiline ? 'textarea' : 'input', {
        ...inputProps,
        ...(multiline ? { rows: 4 } : { type: 'text' }),
        style: {
          width: '100%',
          padding: '8px 10px',
          border: '1px solid #d5d3ce',
          borderRadius: 6,
          fontSize: 14,
          lineHeight: 1.5,
          resize: multiline ? 'vertical' : undefined,
        },
      }),
      React.createElement(
        'p',
        {
          style: {
            margin: '6px 0 0',
            fontSize: 12,
            color: inRange ? '#3d6b62' : '#66706c',
          },
        },
        `${count} characters · recommended ${recommendedMin}–${recommendedMax}`
      )
    );
  });
}

const SeoTitleCountField = createSeoCountField(50, 60);
const MetaDescriptionCountField = createSeoCountField(140, 160, true);

/** Official editor categories. Add a string here to expand the dropdown. */
const BLOG_CATEGORIES = [
  'Clinical Psychology',
  'Anxiety',
  'Depression',
  'Trauma & PTSD',
  'Relationships',
  'Online Therapy',
  'Mental Health',
  'Personal Growth',
] as const;

/** Stored on current drafts; kept so opening those posts does not rewrite category. */
const EXISTING_CATEGORY_VALUES = ['Trauma', 'Couples Therapy'] as const;

const categoryOptions = [...BLOG_CATEGORIES, ...EXISTING_CATEGORY_VALUES].map(
  (category) => ({
    value: category,
    label: category,
  })
);

export default defineConfig({
  branch,
  ...(isLocal
    ? {
        authProvider: new LocalAuthProvider(),
      }
    : {
        clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
        token: process.env.TINA_TOKEN,
      }),
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'images/blog',
    },
  },
  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'src/content/blog',
        format: 'md',
        match: {
          include: '**/*',
          exclude: '{_*,README}',
        },
        defaultItem: () => ({
          author: 'Ambreen Rashid Khan',
          status: 'draft',
          date: new Date().toISOString().slice(0, 10),
        }),
        ui: {
          filename: {
            readonly: true,
            description:
              'Generated from the Article Title for new posts only. This becomes the public URL (/blog/your-filename). Existing filenames never change when a title is edited.',
            slugify: (values) => uniqueSlugFromTitle(values?.title || 'new-article'),
            parse: (filename) => slugifyTitle(filename) || 'new-article',
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Article Title',
            description:
              'This is the visible article headline. For new posts, the URL filename is generated from this title.',
            isTitle: true,
            required: true,
          },
          {
            type: 'image',
            name: 'image',
            label: 'Featured Image',
            description:
              'Choose an existing image or upload a new one. Files are stored in public/images/blog/. Existing paths such as /images/blog/psychologist-in-lahore.webp continue to work.',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Article Content',
            isBody: true,
          },
          {
            type: 'string',
            name: 'status',
            label: 'Status',
            description:
              'Draft = hidden from website and sitemap. Published = visible publicly after deployment.',
            options: [
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
            ],
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Publish Date',
            description: 'Date shown publicly when the article is published.',
            ui: {
              dateFormat: 'YYYY-MM-DD',
              parse: (value) => {
                if (!value) {
                  return value;
                }
                if (typeof value === 'string') {
                  return value.slice(0, 10);
                }
                if (typeof value.format === 'function') {
                  return value.format('YYYY-MM-DD');
                }
                return value;
              },
            },
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            options: categoryOptions,
          },
          {
            type: 'string',
            name: 'author',
            label: 'Author',
          },
          {
            type: 'string',
            name: 'seoTitle',
            label: 'SEO Title',
            description: 'Guidance only. Recommended: 50–60 characters. Saving is never blocked.',
            ui: {
              component: SeoTitleCountField,
            },
          },
          {
            type: 'string',
            name: 'description',
            label: 'Meta Description',
            description: 'Guidance only. Recommended: 140–160 characters. Saving is never blocked.',
            ui: {
              component: MetaDescriptionCountField,
            },
          },
          {
            type: 'string',
            name: 'primaryKeyword',
            label: 'Primary SEO Keyword',
            description: 'Main search phrase targeted by this article.',
          },
        ],
      },
    ],
  },
});
