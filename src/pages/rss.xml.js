/**
 * Full-content RSS feed at /rss.xml.
 *
 * Unlike a summary feed, this renders each essay's entire Markdown body to
 * sanitized HTML so readers (and syndication tools) get the whole piece. The
 * feed `site` comes from astro.config's `site` via context.site, so it tracks
 * SITE_URL automatically. Each item links to the root-level essay URL.
 */
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

const parser = new MarkdownIt();

export async function GET(context) {
  // Match the site's "published" rule: drop drafts.
  const essays = (await getCollection("essays", ({ data }) => data.draft !== true)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: essays.map((essay) => ({
      title: essay.data.title,
      description: essay.data.description,
      pubDate: essay.data.publishDate,
      link: `/${essay.id}`,
      categories: essay.data.tags,
      content: sanitizeHtml(parser.render(essay.body ?? ""), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ["src", "alt", "title"],
        },
      }),
    })),
    // Optional stylesheet so the raw feed is readable in a browser.
    customData: `<language>en-us</language>`,
  });
}
