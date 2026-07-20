# CLAUDE.md — operating guide for this repo

This is **Viktor Kessler's personal writing site** (Astro, static). It is the
**canonical home** for long-form essays and the single source that fans out to
other places. Read this before adding content or changing the publish pipeline.

## The mental model (publish once → fan out)

```
  Markdown essay in src/content/essays/   ← the ONE source of truth
                 │
   astro build ──┼── writing site (this repo)  = canonical origin
                 ├── /essays.json  ──► vakamo.com fetches it at build time
                 │                     → vakamo.com/resources/blog (full republish, canonical → here)
                 └── on push to main, GitHub Actions syndicates NEW ORIGINALS to:
                        • dev.to   (full republish, canonical → here)
                        • Bluesky  (link-card announcement)
```

- `SITE_URL` lives once in [`src/consts.ts`](src/consts.ts). Change nowhere else.
- Companion repo: **`../vakamo.com`** (Vue/Vuetify SPA). It fetches this site's
  `/essays.json` at build time and renders + prerenders the essays under
  `/resources/blog`. See its `scripts/fetch-essays.mjs` and `scripts/prerender.mjs`.

## Everyday commands

```bash
npm run dev        # local preview at :4321 — DRAFTS ARE VISIBLE here
npm run build      # static build → dist/ (drafts excluded)
npm run check      # type-check

npm run dry-run    # preview ALL syndication (dev.to + Bluesky), posts nothing
npm run syndicate:dry   # dev.to only, dry
npm run announce:dry    # Bluesky only, dry

npm run syndicate  # POST/PUT to dev.to for real   (needs DEVTO_API_KEY)
npm run announce   # post to Bluesky for real       (needs BLUESKY_* env)
```

**Habit: always `npm run dry-run` before publishing** to see exactly what would
post where.

## Add / publish an essay

1. Create `src/content/essays/<slug>.md`. **The filename is the slug and the
   URL** (`SITE_URL/<slug>`). Frontmatter (schema in
   [`src/content.config.ts`](src/content.config.ts)):
   ```yaml
   ---
   title: "…"
   description: "…"          # plain text, no double-quotes inside
   publishDate: 2026-07-20
   tags: ["tag-one", "tag-two"]
   series: "…"               # optional
   draft: true               # true = staged/hidden; flip to false to publish
   canonicalURL: "https://…" # OPTIONAL — see canonical rule below
   ---
   ```
2. Preview with `npm run dev` (drafts show).
3. **Publish** = set `draft: false`. That makes it appear on the home page, RSS,
   `/essays.json` (→ vakamo), and eligible for syndication.
4. Commit + push to `main` → the syndication workflow runs (see below).

## The canonical rule (this is the whole point of the site)

Every essay emits `<link rel="canonical">`:

- **No `canonicalURL`** (or one pointing at `SITE_URL`) → **self-canonical**.
  This is an ORIGINAL that lives here first. It WILL syndicate to dev.to/Bluesky.
- **`canonicalURL` pointing elsewhere** (e.g. a LinkedIn URL) → this piece
  originated somewhere else. The page shows "Originally published at…", and it
  is **SKIPPED by all syndication** (we never re-broadcast someone else's origin).

The 18 imported "Agnostic Data" essays (`series: "Agnostic Data"`) all have a
LinkedIn `canonicalURL`, so they show on this site + vakamo but are never pushed
to dev.to/Bluesky. New essays you write here have no `canonicalURL` → they do.

## Syndication channels

| Channel | Type | Automated? | Secret(s) |
|---|---|---|---|
| **vakamo.com/resources/blog** | full republish, canonical → here | yes (vakamo build fetches `/essays.json`) | — |
| **dev.to** | full republish, canonical → here | yes, on push to main | `DEVTO_API_KEY` |
| **Bluesky** | link-card announcement | yes, on push to main | `BLUESKY_IDENTIFIER`, `BLUESKY_APP_PASSWORD` |
| **Medium** | full republish (Import-by-URL, auto-canonical) | manual | — |
| **Substack / beehiiv** | newsletter (teaser + link) | manual | — |
| **LinkedIn** | newsletter | manual | — |
| **daily.dev** | RSS aggregator | one-time RSS submit | — |

Automated pipeline: [`.github/workflows/syndicate.yml`](.github/workflows/syndicate.yml)
runs on push to `main` touching `src/content/essays/**` (or manual dispatch).
Each step is gated on its secret, commits `data/*-map.json` back. The map files
(`data/devto-map.json`, `data/bluesky-map.json`) prevent duplicate posts — **keep
them committed**.

Setup steps for each channel (get keys, add repo secrets, Medium/Substack/beehiiv
manual flows) are in the [README](README.md) → "Syndication" section.

## Guardrails / gotchas

- **Never edit `SITE_URL` anywhere but `src/consts.ts`.**
- Node **≥ 22.18** required (scripts import `SITE_URL` from `consts.ts` via TS
  type-stripping; CI uses Node 24).
- Imported/verbatim content should be **proofread** — extraction can paraphrase.
- To pull an essay after publishing: set `draft: true` again → it drops off this
  site and vakamo on the next build (dev.to/Bluesky copies persist; update/delete
  those on the platform).
- Changing vakamo: it reads `WRITING_ESSAYS_URL` (defaults to the placeholder
  domain) at build. Set it to the live writing domain in vakamo's host env.
