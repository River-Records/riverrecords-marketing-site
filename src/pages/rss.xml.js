import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// Blog feed at /rss.xml — used by readers and by the blog→LinkedIn automation.
// Each item's <description> carries the LinkedIn-native caption when the post
// sets `linkedinCaption` in frontmatter, otherwise it falls back to the SEO
// description. Routing the caption through the standard <description> field lets
// no-code RSS posters (e.g. Buffer) publish the bespoke caption without needing
// to read a custom XML element. (The site itself reads `description` straight
// from the content collection, so this does not affect on-page copy or SEO.)
export async function GET(context) {
  // Exclude posts tagged "comparisons" — these are SEO buying-guide/comparison
  // pages that live in the blog collection (and stay fully web-indexable) but
  // should NOT auto-syndicate to LinkedIn via this feed.
  const posts = (await getCollection('blog', ({ data }) =>
    !data.draft && !data.tags.includes('comparisons')))
    .sort((a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime());

  return rss({
    title: 'Stream by River Records — Blog',
    description:
      'Insights on AI medical scribes, clinical documentation, problem-oriented charting, and the future of primary care technology.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      // LinkedIn-native caption when present; SEO description otherwise.
      description: post.data.linkedinCaption ?? post.data.description,
      pubDate: new Date(post.data.publishDate),
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
}
