# Viktor Kessler — Writing

The canonical home for my long-form essays on data architecture, lakehouses,
governance, and AI. Content-first, statically generated with
[Astro](https://astro.build), owned end-to-end, and syndicated
**publish-once → everywhere** with the canonical URL always pointing back here.

- **Stack:** Astro 7 + TypeScript, ~zero client JS.
- **Content:** Markdown/MDX in [`src/content/essays/`](src/content/essays/),
  validated by a zod schema in [`src/content.config.ts`](src/content.config.ts).
- **SEO:** self-referential `<link rel="canonical">` on every essay, full
  OpenGraph + Twitter tags, auto sitemap, full-content RSS.
- **Syndication:** one command mirrors essays to dev.to and sets their canonical
  back to this site.

---

## Quick start (local)

Requires **Node ≥ 22.18** (Node 24 recommended — the syndication script imports
a `.ts` constant via Node's built-in type stripping).

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:4321 (drafts visible)
npm run build      # static build into ./dist
npm run preview    # serve ./dist locally to check the production output
npm run check      # type-check .astro + TS
```

Drafts (`draft: true`) are **visible in `npm run dev`** but **excluded from
`npm run build`**, RSS, and syndication.

---

## Add an essay

1. Create `src/content/essays/my-new-essay.md`. The **filename is the slug** and
   the URL: this file publishes at `/my-new-essay`.
2. Add frontmatter — the schema is enforced at build time:

   ```yaml
   ---
   title: "Your Title"
   description: "One or two sentences. Used for meta description, cards, RSS."
   publishDate: 2026-07-15            # required, YYYY-MM-DD
   updatedDate: 2026-07-20            # optional
   tags: ["lakehouse", "governance"]  # optional, drives /tags
   series: "Foundations"              # optional, drives /series
   draft: false                       # optional, default false
   canonicalURL: "https://..."        # optional — see below
   ---
   ```

3. Write Markdown (or rename to `.mdx` for components). Done — the home page,
   series/tag pages, sitemap, and RSS pick it up automatically.

### The `canonicalURL` field

Leave it **unset** for anything you write here first (the normal case). The
essay's canonical then self-references `SITE_URL/<slug>`, making this site the
SEO origin.

Set it **only** when the true original lives elsewhere (e.g. you're reposting a
company blog piece). The page will render an "Originally published at…" note and
emit that URL as canonical instead.

See any of the essays in [`src/content/essays/`](src/content/essays/) for a
working example — e.g.
[`the-two-universes-inside-your-data-lake.md`](src/content/essays/the-two-universes-inside-your-data-lake.md),
which uses `canonicalURL` to point back to its original publication.

---

## Set `SITE_URL` + custom domain

`SITE_URL` is defined **once** in [`src/consts.ts`](src/consts.ts):

```ts
export const SITE_URL = "https://YOURDOMAIN.com";
```

Change that single line to your real domain. It drives canonical tags,
OpenGraph URLs, RSS, the sitemap, `robots.txt`, and the dev.to `canonical_url`.
`astro.config.mjs` reads the same constant for its `site` setting, so there is
nothing else to update.

Pointing a custom domain is a host setting (below) plus a DNS record — the code
doesn't care what the domain is beyond `SITE_URL`.

---

## Syndication: publish-once → dev.to

Essays are authored here and mirrored to dev.to. dev.to receives
`canonical_url = SITE_URL/<slug>`, so Google still credits this site.

### One-time: get + store your dev.to API key

1. Go to **dev.to → Settings → Extensions → "DEV Community API Keys"**
   (<https://dev.to/settings/extensions>). Generate a key.
2. Local runs: copy `.env.example` to `.env` and paste the key. (`.env` is
   gitignored — never commit it.)
3. CI: add it as a repo secret (see below).

### Run it

```bash
# preview what would happen — writes nothing to dev.to
DEVTO_API_KEY=xxx node scripts/syndicate-devto.mjs --dry-run

# actually syndicate
DEVTO_API_KEY=xxx npm run syndicate
```

- First run for an essay → **POST** (create). The returned dev.to id + url are
  saved to [`data/devto-map.json`](data/devto-map.json).
- Later runs for the same essay → **PUT** (update). No duplicates, ever, because
  the map is the source of truth. **Commit `data/devto-map.json`** after runs.
- Rate limits are handled: 2s between calls, exponential backoff on HTTP 429.

### What gets syndicated (important)

The automated channels only act on **new originals**: essays that are published
(`draft: false`) **and** self-canonical (no `canonicalURL`, or a `canonicalURL`
that points at this site). Any essay with an **external** `canonicalURL` — e.g.
the imported LinkedIn newsletter archive — is **skipped**. So syndication never
re-broadcasts content that first appeared somewhere else; it only pushes work
that originates here, always with the canonical pointing back to this site.

### Automated via GitHub Actions

[`.github/workflows/syndicate.yml`](.github/workflows/syndicate.yml) runs on push
to `main` whenever `src/content/essays/**` changes (and via **Actions → Syndicate
& announce essays → Run workflow**). Each step is gated on its secret, so
channels you haven't configured are simply skipped. It commits the updated map
files (`data/devto-map.json`, `data/bluesky-map.json`) back to the repo.

**Add the repo secrets** (Settings → Secrets and variables → Actions, or `gh secret set <NAME>`):

- `DEVTO_API_KEY` — enables the dev.to full-content republish.
- `BLUESKY_IDENTIFIER` — your Bluesky handle (e.g. `viktor.bsky.social`).
- `BLUESKY_APP_PASSWORD` — a Bluesky **app password** (Settings → App Passwords),
  *not* your account password.

### Bluesky (announcement, not republish)

[`scripts/announce-bluesky.mjs`](scripts/announce-bluesky.mjs) posts a short note
with a rich **link card** back to each new essay — it does **not** copy the body,
so there's no canonical/duplicate concern. A committed `data/bluesky-map.json`
(slug → post uri) guarantees each essay is announced exactly once.

```bash
# preview (no posting, no secrets needed)
node scripts/announce-bluesky.mjs --dry-run

# post for real
BLUESKY_IDENTIFIER=you.bsky.social BLUESKY_APP_PASSWORD=xxxx npm run announce
```

### Medium (manual import — keeps canonical)

Medium **retired its publishing API**, so there's no automated adapter — and the
manual path is actually the *best* behavior for SEO:

1. Publish the essay here first (it must be live at `SITE_URL/<slug>`).
2. Medium → top-right avatar → **Stories** → **Import a story** (or go straight to
   `https://medium.com/p/import`).
3. Paste `SITE_URL/<slug>` and click **Import**.
4. Medium fetches the piece and **automatically sets `rel=canonical` back to your
   URL** — verify under the story's **⋯ → Story settings → Advanced settings →
   canonical link**.
5. Publish on Medium.

Result: Medium hosts a copy for reach, but search engines still credit your site
as the origin. No code, no API key.

### Hashnode (stub — automatable later)

[`scripts/syndicate-hashnode.mjs`](scripts/syndicate-hashnode.mjs) is a documented
**TODO stub**. To finish it: implement the GraphQL `publishPost`/`updatePost`
calls, set `originalArticleURL` to the canonical, maintain a
`data/hashnode-map.json`, and add a `HASHNODE_API_KEY`-gated step to the workflow
(same shape as the dev.to step).

### Substack (manual republish — owned email audience)

Substack has **no public publishing API**, so cross-posting is manual (like
Medium). Its value is a mailing list you *own* plus Substack's own network
(Notes, recommendations) — a good fit for long-form essays, but it overlaps the
LinkedIn newsletter, so only do it if you'll commit to it.

1. Publish here first (live at `SITE_URL/<slug>`).
2. In Substack, start a new post and paste the essay (Substack accepts pasted
   Markdown/rich text).
3. **Set the canonical** so your site stays the SEO origin: post editor →
   settings (gear / three-dots) → **Canonical URL** → `SITE_URL/<slug>`.
4. Publish. Substack now hosts a copy for its audience, credited to your site.

### beehiiv (newsletter — email/announcement, manual)

beehiiv *does* have a create-post API (`POST /v2/publications/{id}/posts`), but
it's **Enterprise-only/beta** and **can't set a canonical URL**, so a full-content
web republish there would be a canonical-less duplicate. Treat it as an email
channel instead:

- **Recommended:** send a short **teaser + link** back to `SITE_URL/<slug>` — no
  duplicate-content risk, drives traffic to the canonical home.
- Or use a beehiiv **RSS block** (with "refresh on send") in a recurring send to
  auto-pull your latest post into the email — near-zero effort, still a link-out.
- Full-body cross-posts: avoid unless you keep them **email-only** (no public web
  version), since beehiiv won't point a canonical back here.

### daily.dev (optional, zero-code reach)

If you want extra developer-feed reach for free: submit this site's RSS feed
(`SITE_URL/rss.xml`) once as a daily.dev source and new posts are ingested
automatically. Passive discovery only — skip it if it's not your audience.

---

## Deploy (static hosting)

`npm run build` outputs a plain static site to `./dist`. Deploy it anywhere.

### Cloudflare Pages

- Connect the repo. **Build command:** `npm run build`. **Output dir:** `dist`.
- Custom domain: **Pages project → Custom domains → Set up a domain** (adds the
  DNS record for you if the zone is on Cloudflare).

### Netlify

- Connect the repo (or `netlify deploy`). **Build:** `npm run build`.
  **Publish directory:** `dist`.
- Custom domain: **Site settings → Domain management**, then point your DNS
  (`CNAME` to the Netlify subdomain, or Netlify DNS).

### GitHub Pages

- Set `SITE_URL` to your Pages URL (e.g. `https://user.github.io/repo` or your
  custom domain). If deploying to a **project subpath**, also set `base: "/repo"`
  in `astro.config.mjs`.
- Use the official Astro Pages action, or build and push `dist` to the `gh-pages`
  branch. Custom domain: repo **Settings → Pages → Custom domain** (creates a
  `CNAME` file) and add the DNS record at your registrar.

After deploying, **update `SITE_URL`** so canonicals, RSS, and syndication all
use the live origin.

---

## Project layout

```
src/
  consts.ts              # SITE_URL + identity — the one-line-change file
  content.config.ts      # zod frontmatter schema (essays collection)
  content/essays/        # your essays (.md / .mdx)
  components/            # BaseHead (SEO/canonical), Header, Footer, EssayCard…
  layouts/BaseLayout.astro
  pages/
    index.astro          # home: newest-first + series/tag filters
    [slug].astro         # essay page (emits canonical) — served at site root
    series/              # series index + per-series pages
    tags/                # tag index + per-tag pages
    about.astro          # about stub
    rss.xml.js           # full-content RSS
    robots.txt.ts        # robots + sitemap pointer
  utils/                 # published-essay query, reading time
scripts/
  syndicate-devto.mjs    # dev.to syndication (create/update, rate-limited)
  syndicate-hashnode.mjs # TODO stub
data/devto-map.json      # committed slug -> dev.to { id, url } map
.github/workflows/syndicate.yml
```
