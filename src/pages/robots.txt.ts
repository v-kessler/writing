/**
 * Dynamically-generated /robots.txt. Points crawlers at the sitemap using the
 * configured site origin, so it stays correct when you change SITE_URL.
 */
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", site).href}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
