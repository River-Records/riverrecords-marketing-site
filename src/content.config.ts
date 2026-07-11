import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    author: z.string(),
    publishDate: z.coerce.date(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    readTime: z.string().optional(),
    draft: z.boolean().default(false),
    // LinkedIn-native caption for auto-syndication (surfaced in /rss.xml).
    linkedinCaption: z.string().optional(),
    // Series grouping: shared `series` name + 1-based `seriesPart` order.
    series: z.string().optional(),
    seriesPart: z.number().optional(),
  }),
});

const features = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/features' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    hasPage: z.boolean().default(false),
    draft: z.boolean().default(false),
    order: z.number().default(0),
    tags: z.array(z.string()).default([]),
    bullets: z.array(z.string()).default([]),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).default([]),
  }),
});

const book = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/book' }),
  schema: z.object({
    title: z.string(),
    // "Chapter 4", "Interlude", "Afterword" — shown as the eyebrow label.
    chapterLabel: z.string(),
    // "Part I — Anatomy of a Relic" etc.; omitted for front/back matter.
    part: z.string().optional(),
    // Reading order across the whole book; drives prev/next and the TOC.
    order: z.number(),
    description: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    draft: z.boolean().default(false),
    // Blog essays this chapter draws on — rendered as internal links.
    relatedPosts: z
      .array(z.object({ slug: z.string(), title: z.string() }))
      .default([]),
  }),
});

export const collections = { blog, features, book };
