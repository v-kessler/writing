import { getCollection, type CollectionEntry } from "astro:content";

export type Essay = CollectionEntry<"essays">;

/**
 * All PUBLISHED essays, newest first.
 *
 * Drafts (draft: true) are hidden in production builds but visible in `dev`
 * so you can preview work-in-progress locally. This single function is the
 * source of truth for "what's live" — the home page, series/tag pages, RSS,
 * and the syndication script all agree because they all start here.
 */
export async function getPublishedEssays(): Promise<Essay[]> {
  const essays = await getCollection("essays", ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
  return essays.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );
}

/** Unique tags across published essays, with counts, sorted by frequency. */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const essays = await getPublishedEssays();
  const counts = new Map<string, number>();
  for (const e of essays) {
    for (const t of e.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Unique series across published essays, with counts. */
export async function getAllSeries(): Promise<
  { series: string; count: number }[]
> {
  const essays = await getPublishedEssays();
  const counts = new Map<string, number>();
  for (const e of essays) {
    if (e.data.series)
      counts.set(e.data.series, (counts.get(e.data.series) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([series, count]) => ({ series, count }))
    .sort((a, b) => a.series.localeCompare(b.series));
}
