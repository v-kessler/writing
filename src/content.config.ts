import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * The `essays` collection.
 *
 * Astro 5+ Content Layer API: content lives as files on disk and is pulled in
 * by a `loader`. The `glob` loader watches src/content/essays for .md/.mdx and
 * derives each entry's `id` from the filename (e.g. my-essay.md -> "my-essay").
 * That `id` IS the slug we route on and send to dev.to.
 *
 * The zod `schema` validates frontmatter at build time — a typo or missing
 * required field fails the build instead of shipping broken metadata.
 */
const essays = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/essays" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // z.coerce.date() accepts a plain "YYYY-MM-DD" string in frontmatter
      // and coerces it into a real Date object.
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      series: z.string().optional(),
      draft: z.boolean().default(false),
      // If set, this OVERRIDES the self-referential canonical — use it only
      // when the true origin of a piece lives somewhere else.
      canonicalURL: z.string().url().optional(),
      // Optional social/hero image, resolved relative to the essay file.
      ogImage: image().optional(),
    }),
});

export const collections = { essays };
