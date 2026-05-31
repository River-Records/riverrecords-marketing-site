import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// Blog feed at /rss.xml — used by readers and by blog→LinkedIn automation.
// Each item exposes <linkedinCaption> (when set in frontmatter) so an
// automation tool (Make/Zapier/etc.) can post a LinkedIn-native caption
// rather than the SEO description.
export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime());

  return rss({
    title: 'Stream by River Records — Blog',
    description:
      'Insights on AI medical scribes, clinical documentation, problem-oriented charting, and the future of primary care technology.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.publishDate),
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      // Custom element consumed by the LinkedIn automation; falls back to the
      // description when no bespoke caption is provided.
      customData: `<linkedinCaption><![CDATA[${
        post.data.linkedinCaption ?? post.data.description
      }]]></linkedinCaption>`,
    })),
    customData: '<language>en-us</language>',
  });
}
