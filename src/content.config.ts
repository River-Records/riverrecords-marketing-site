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

export const collections = { blog, features };
