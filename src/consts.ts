/**
 * Site-wide constants — the single source of truth.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  CHANGE THIS ONE LINE when you point the site at your real domain.     │
 * │  It drives canonical <link> tags, OpenGraph URLs, the RSS feed, the    │
 * │  sitemap, and the dev.to syndication `canonical_url`.                   │
 * └──────────────────────────────────────────────────────────────────────┘
 */
export const SITE_URL = "https://vakamo.com";

/** Author + site identity, reused across meta tags, the header, and the RSS feed. */
export const SITE_TITLE = "Viktor Kessler";
export const SITE_DESCRIPTION =
  "Long-form essays on data architecture, lakehouses, governance, and AI — by Viktor Kessler, co-founder of Vakamo and creator of Lakekeeper.";
export const AUTHOR = "Viktor Kessler";

/** Handle used for the Twitter/X card `twitter:creator` tag. Leave empty to omit. */
export const TWITTER_HANDLE = "";

/**
 * Essays are served at the site ROOT (e.g. /my-essay-slug), not
 * under /essays/. This makes the canonical URL trivially self-referential and
 * identical to the `canonical_url` we send to dev.to.
 *
 * These two helpers are the ONLY place essay URLs are constructed, so the
 * "canonical = SITE_URL + '/' + slug" rule is enforced in exactly one spot.
 */
export const essayPath = (slug: string): string => `/${slug}`;

/**
 * The PUBLIC canonical home of an essay. This repo is the source of truth for the
 * text, but the published origin is vakamo.com/resources/blog/<slug> — so canonical
 * tags, /essays.json, RSS links and the dev.to `canonical_url` all point there.
 * `essayPath` stays root-relative because it only drives this repo's local preview.
 */
export const essayURL = (slug: string): string =>
  `${SITE_URL}/resources/blog/${slug}`;

/** Primary nav — rendered in the header. */
export const NAV_LINKS = [
  { href: "/", label: "Essays" },
  { href: "/series", label: "Series" },
  { href: "/tags", label: "Tags" },
  { href: "/about", label: "About" },
] as const;
