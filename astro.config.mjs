// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// Keep the deployed origin in ONE place. astro.config runs in Node before the
// TS path aliases exist, so we import the constant from source directly.
import { SITE_URL } from "./src/consts.ts";

// https://astro.build/config
export default defineConfig({
  // `site` MUST be an absolute URL beginning with http(s). It powers the
  // sitemap, RSS `context.site`, and any Astro.site usage in templates.
  site: SITE_URL,

  // Fully static output — the whole point is a site you own and can host
  // anywhere as plain files.
  output: "static",

  integrations: [
    mdx(),
    // Emits sitemap-index.xml + sitemap-0.xml at build time.
    sitemap(),
  ],

  // Prettier, extension-less URLs: /my-essay instead of /my-essay/index.html
  // served as /my-essay/. "directory" (default) also works; "file" is flatter.
  build: {
    format: "directory",
  },

  markdown: {
    shikiConfig: {
      // Dual themes so code blocks look right in both color schemes. Our CSS
      // flips between them via the `.astro-code` CSS variables Shiki emits.
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
