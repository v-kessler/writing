#!/usr/bin/env node
/**
 * announce-bluesky.mjs — announce new essays on Bluesky (AT Protocol).
 *
 * Bluesky is a microblog, not a blog host: we do NOT republish the essay body
 * there. We post a short note with a rich link card pointing back to the essay
 * on this site. So there is no canonical/duplicate-content concern — it's pure
 * distribution.
 *
 * Same rules as the dev.to pipeline:
 *   - published only (draft !== true)
 *   - ORIGINALS only — skip essays with an external canonicalURL (the LinkedIn
 *     archive already lives elsewhere; we don't re-announce it)
 *   - a committed map (data/bluesky-map.json: slug -> { uri, cid }) so each
 *     essay is announced exactly once, even across re-runs
 *
 * Auth (env):
 *   BLUESKY_IDENTIFIER   your handle, e.g. viktor.bsky.social (or custom domain)
 *   BLUESKY_APP_PASSWORD an app password from Settings → App Passwords (NOT your
 *                        main password)
 *   BLUESKY_SERVICE      optional, defaults to https://bsky.social
 *
 * Run with --dry-run to preview without posting.
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import matter from "gray-matter";

import { SITE_URL, essayURL } from "../src/consts.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ESSAYS_DIR = join(ROOT, "src", "content", "essays");
const MAP_PATH = join(ROOT, "data", "bluesky-map.json");

const SERVICE = process.env.BLUESKY_SERVICE || "https://bsky.social";
const IDENTIFIER = process.env.BLUESKY_IDENTIFIER;
const APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD;
const DRY_RUN = process.argv.includes("--dry-run");

const DELAY_BETWEEN_POSTS_MS = 1500;
const POST_MAX = 300; // Bluesky post grapheme limit

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log("[announce:bluesky]", ...a);

/** Published ORIGINALS only (same guard as the dev.to script). */
async function loadPublishedOriginals() {
  const files = (await readdir(ESSAYS_DIR)).filter((f) => /\.(md|mdx)$/.test(f));
  const essays = [];
  for (const file of files) {
    const raw = await readFile(join(ESSAYS_DIR, file), "utf8");
    const { data } = matter(raw);
    if (data.draft === true) continue;
    if (data.canonicalURL && !data.canonicalURL.startsWith(SITE_URL)) continue;
    essays.push({ slug: file.replace(/\.(md|mdx)$/, ""), frontmatter: data });
  }
  // Oldest first, so a first run announces in chronological order.
  return essays.sort(
    (a, b) =>
      new Date(a.frontmatter.publishDate).valueOf() -
      new Date(b.frontmatter.publishDate).valueOf(),
  );
}

async function loadMap() {
  try {
    return JSON.parse(await readFile(MAP_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function saveMap(map) {
  const ordered = Object.fromEntries(
    Object.keys(map)
      .sort()
      .map((k) => [k, map[k]]),
  );
  await writeFile(MAP_PATH, JSON.stringify(ordered, null, 2) + "\n");
}

/** Trim to Bluesky's limit on a word boundary. */
function clamp(text, max) {
  if ([...text].length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

async function createSession() {
  const res = await fetch(`${SERVICE}/xrpc/com.atproto.server.createSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: IDENTIFIER, password: APP_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`createSession failed: ${res.status} ${await res.text()}`);
  }
  return res.json(); // { accessJwt, did, handle, ... }
}

async function postAnnouncement(session, essay) {
  const url = essayURL(essay.slug);
  const title = essay.frontmatter.title;
  const description = essay.frontmatter.description ?? "";
  const text = clamp(`New essay: ${title}`, POST_MAX);

  const record = {
    $type: "app.bsky.feed.post",
    text,
    createdAt: new Date().toISOString(),
    // Rich link card. Bluesky renders it from the fields we pass — no fetch.
    embed: {
      $type: "app.bsky.embed.external",
      external: { uri: url, title, description: clamp(description, 280) },
    },
  };

  const res = await fetch(`${SERVICE}/xrpc/com.atproto.repo.createRecord`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessJwt}`,
    },
    body: JSON.stringify({
      repo: session.did,
      collection: "app.bsky.feed.post",
      record,
    }),
  });
  if (!res.ok) {
    throw new Error(`createRecord failed: ${res.status} ${await res.text()}`);
  }
  return res.json(); // { uri, cid }
}

async function main() {
  if (!DRY_RUN && (!IDENTIFIER || !APP_PASSWORD)) {
    console.error(
      "ERROR: set BLUESKY_IDENTIFIER and BLUESKY_APP_PASSWORD (or use --dry-run).",
    );
    process.exit(1);
  }

  const essays = await loadPublishedOriginals();
  const map = await loadMap();
  const pending = essays.filter((e) => !map[e.slug]);

  log(
    `${essays.length} published original(s); ${pending.length} not yet announced. Dry run: ${DRY_RUN}`,
  );

  if (pending.length === 0) {
    log("nothing to announce.");
    return;
  }

  if (DRY_RUN) {
    for (const e of pending) {
      log(`would announce "${e.slug}" -> ${essayURL(e.slug)}`);
    }
    return;
  }

  const session = await createSession();
  for (const [i, essay] of pending.entries()) {
    try {
      const result = await postAnnouncement(session, essay);
      map[essay.slug] = { uri: result.uri, cid: result.cid };
      log(`announced "${essay.slug}" -> ${result.uri}`);
      await saveMap(map); // persist immediately to avoid dupes on crash
    } catch (err) {
      console.error(`FAILED "${essay.slug}": ${err.message}`);
      process.exitCode = 1;
    }
    if (i < pending.length - 1) await sleep(DELAY_BETWEEN_POSTS_MS);
  }

  await saveMap(map);
  log("done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
