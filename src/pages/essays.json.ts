/**
 * /essays.json — the syndication manifest.
 *
 * A build-time JSON endpoint that exposes every PUBLISHED essay as structured
 * data, including the raw Markdown body and the canonical URL. Other properties
 * (vakamo.com, future consumers) fetch this at THEIR build time and render the
 * content themselves, always pointing their canonical back here.
 *
 * This is the machine-readable twin of the RSS feed: RSS is for readers,
 * essays.json is for other build pipelines.
 */
import type { APIRoute } from "astro";
import { essayURL } from "../consts";
import { getPublishedEssays } from "../utils/essays";
import { readingTime } from "../utils/reading-time";

export const GET: APIRoute = async () => {
  const essays = await getPublishedEssays();

  const manifest = essays.map((essay) => {
    const d = essay.data;
    return {
      slug: essay.id,
      title: d.title,
      description: d.description,
      publishDate: d.publishDate.toISOString(),
      updatedDate: d.updatedDate ? d.updatedDate.toISOString() : null,
      tags: d.tags,
      series: d.series ?? null,
      readingTime: readingTime(essay.body ?? ""),
      // The canonical origin: an explicit override wins, else this site.
      canonicalUrl: d.canonicalURL ?? essayURL(essay.id),
      // Raw Markdown body so consumers can render the full piece themselves.
      body: essay.body ?? "",
    };
  });

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Let CDNs cache it briefly; consumers fetch at build time anyway.
      "Cache-Control": "public, max-age=600",
    },
  });
};
