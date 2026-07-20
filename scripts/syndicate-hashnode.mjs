#!/usr/bin/env node
/**
 * syndicate-hashnode.mjs — STUB / TODO.
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │  NOT IMPLEMENTED YET. This is a scaffold so the Hashnode adapter mirrors │
 * │  the dev.to one (same publish-once → syndicate contract).                │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * When you implement it, keep the same shape as syndicate-devto.mjs:
 *   1. loadPublishedEssays()  — identical; consider extracting to a shared lib.
 *   2. Maintain data/hashnode-map.json (slug -> { id, url }) for upserts.
 *   3. Set the canonical back to SITE_URL + "/" + slug.
 *
 * Hashnode specifics to wire up:
 *   - API: GraphQL endpoint at https://gql.hashnode.com/
 *   - Auth: header `Authorization: <HASHNODE_API_KEY>` (personal access token
 *     from https://hashnode.com/settings/developer). Add it as a repo secret
 *     named HASHNODE_API_KEY, same as DEVTO_API_KEY.
 *   - Create:  `publishPost` mutation. Requires your publicationId
 *     (query `me { publications { edges { node { id } } } }`).
 *   - Update:  `updatePost` mutation, keyed by the stored post id.
 *   - Canonical: set `originalArticleURL` in PublishPostInput /
 *     UpdatePostInput to SITE_URL + "/" + slug.
 *   - Tags: Hashnode wants tag objects with a slug/name, not bare strings.
 *
 * TODO: implement the GraphQL calls, the map file, and rate-limit handling,
 * then add a matching step to .github/workflows/syndicate.yml gated on a
 * HASHNODE_API_KEY secret.
 */

console.error(
  "syndicate-hashnode.mjs is a stub — not implemented yet. See the TODO in this file.",
);
process.exit(1);
