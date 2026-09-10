#!/usr/bin/env node
/**
 * syndicate-devto.mjs — publish-once, syndicate-everywhere (dev.to adapter).
 *
 * What it does
 * ------------
 * 1. Reads every PUBLISHED essay (draft !== true) from src/content/essays.
 * 2. For each one, upserts it to dev.to via the REST API:
 *      - never seen before  -> POST   /api/articles      (create)
 *      - already syndicated -> PUT    /api/articles/{id} (update)
 *    Which is which is decided by data/devto-map.json, a COMMITTED map of
 *    slug -> { id, url }. This is what prevents duplicate cross-posts on re-run.
 * 3. Sets canonical_url = essayURL(slug) on every article, so dev.to
 *    tells search engines THIS site is the origin.
 * 4. Respects rate limits: a delay between calls + exponential backoff on 429.
 *
 * Auth: expects process.env.DEVTO_API_KEY (see .env.example / README).
 *
 * Safe to run repeatedly. Run with `--dry-run` to preview without writing to
 * dev.to.  Requires Node >= 22.18 (imports SITE_URL from a .ts file via Node's
 * built-in type stripping).
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import matter from "gray-matter";

// SITE_URL lives in exactly one place. Node strips the TS types on import.
import { SITE_URL, essayURL } from "../src/consts.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ESSAYS_DIR = join(ROOT, "src", "content", "essays");
const MAP_PATH = join(ROOT, "data", "devto-map.json");

const DEVTO_API = "https://dev.to/api/articles";
const API_KEY = process.env.DEVTO_API_KEY;
const DRY_RUN = process.argv.includes("--dry-run");

// Rate-limit tuning. dev.to is strict; be a polite citizen.
const DELAY_BETWEEN_CALLS_MS = 2000;
const MAX_RETRIES = 5;

// --------------------------------------------------------------------- utils
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function log(...args) {
  console.log("[syndicate:devto]", ...args);
}

/** dev.to tags: lowercase, alphanumeric only, max 4. */
function normalizeTags(tags = []) {
  return tags
    .map((t) => String(t).toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter(Boolean)
    .slice(0, 4);
}

/**
 * Read + parse every essay, returning only ones we should syndicate:
 * published (not draft) AND originating on THIS site.
 *
 * We deliberately SKIP essays whose canonicalURL points somewhere else (e.g.
 * the LinkedIn newsletter archive). Those were first published elsewhere — the
 * strategy is to syndicate our own originals to dev.to, not to re-broadcast an
 * archive that already lives on another platform. An essay with no canonicalURL
 * (self-canonical) is an original and IS syndicated.
 */
async function loadPublishedEssays() {
  const files = (await readdir(ESSAYS_DIR)).filter((f) =>
    /\.(md|mdx)$/.test(f),
  );
  const essays = [];
  for (const file of files) {
    const raw = await readFile(join(ESSAYS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    if (data.draft === true) continue;
    const slug = file.replace(/\.(md|mdx)$/, "");
    // Skip pieces that originate elsewhere (external canonical).
    if (data.canonicalURL && !data.canonicalURL.startsWith(SITE_URL)) {
      log(`skipping "${slug}" — external canonical (${data.canonicalURL})`);
      continue;
    }
    essays.push({ slug, frontmatter: data, body: content });
  }
  return essays;
}

async function loadMap() {
  try {
    return JSON.parse(await readFile(MAP_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function saveMap(map) {
  // Stable key order keeps the committed diff small and reviewable.
  const ordered = Object.fromEntries(
    Object.keys(map)
      .sort()
      .map((k) => [k, map[k]]),
  );
  await writeFile(MAP_PATH, JSON.stringify(ordered, null, 2) + "\n");
}

/**
 * One HTTP call to dev.to with 429-aware exponential backoff. Returns the
 * parsed JSON body on success; throws on non-retryable errors.
 */
async function devtoRequest(method, url, article) {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await fetch(url, {
      method,
      headers: {
        "api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "application/vnd.forem.api-v1+json",
      },
      body: JSON.stringify({ article }),
    });

    if (res.status === 429) {
      attempt++;
      if (attempt > MAX_RETRIES) {
        throw new Error(`Rate limited after ${MAX_RETRIES} retries: ${url}`);
      }
      // Honor Retry-After if present, else exponential backoff (2s,4s,8s,...).
      const retryAfter = Number(res.headers.get("retry-after"));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : DELAY_BETWEEN_CALLS_MS * 2 ** attempt;
      log(`429 rate limited — backing off ${wait}ms (attempt ${attempt})`);
      await sleep(wait);
      continue;
    }

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`dev.to ${method} ${url} -> ${res.status}: ${text}`);
    }
    return text ? JSON.parse(text) : {};
  }
}

/** Build the dev.to article payload from an essay. */
function toArticle(essay) {
  // Respect an explicit canonical override (e.g. a piece first published on
  // LinkedIn); otherwise the writing site is the origin. This keeps every
  // syndicated copy pointing at the SAME origin the site's own pages declare.
  const canonical =
    essay.frontmatter.canonicalURL ?? essayURL(essay.slug);
  return {
    title: essay.frontmatter.title,
    body_markdown: essay.body,
    published: true,
    canonical_url: canonical,
    description: essay.frontmatter.description ?? "",
    tags: normalizeTags(essay.frontmatter.tags),
  };
}

// ---------------------------------------------------------------------- main
async function main() {
  if (!API_KEY && !DRY_RUN) {
    console.error(
      "ERROR: DEVTO_API_KEY is not set. Export it or run with --dry-run.",
    );
    process.exit(1);
  }

  const essays = await loadPublishedEssays();
  const map = await loadMap();
  log(`${essays.length} published essay(s) found. Dry run: ${DRY_RUN}`);

  let created = 0;
  let updated = 0;

  for (const [i, essay] of essays.entries()) {
    const article = toArticle(essay);
    const existing = map[essay.slug];

    if (DRY_RUN) {
      log(
        `${existing ? "would UPDATE" : "would CREATE"} "${essay.slug}" ` +
          `(canonical ${article.canonical_url}, tags [${article.tags.join(", ")}])`,
      );
      continue;
    }

    try {
      if (existing?.id) {
        await devtoRequest("PUT", `${DEVTO_API}/${existing.id}`, article);
        updated++;
        log(`updated "${essay.slug}" -> ${existing.url}`);
      } else {
        const result = await devtoRequest("POST", DEVTO_API, article);
        map[essay.slug] = { id: result.id, url: result.url };
        created++;
        log(`created "${essay.slug}" -> ${result.url}`);
        // Persist immediately so a mid-run crash never loses a mapping and
        // causes a duplicate on the next run.
        await saveMap(map);
      }
    } catch (err) {
      console.error(`FAILED "${essay.slug}": ${err.message}`);
      process.exitCode = 1;
    }

    // Space out calls (skip the wait after the final essay).
    if (i < essays.length - 1) await sleep(DELAY_BETWEEN_CALLS_MS);
  }

  if (!DRY_RUN) await saveMap(map);
  log(`done. created: ${created}, updated: ${updated}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
