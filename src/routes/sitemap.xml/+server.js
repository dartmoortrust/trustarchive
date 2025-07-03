import { db } from "$lib/server/db";

export async function GET() {
  // Fetch all dynamic slugs (e.g., from a database or API)
  const pages = await db.query("select id from records order by id");

  const urls = pages.rows
    .map(
      (slug) => `
			<url>
				<loc>https://dartmoortrust.org/archive/record/${slug.id}</loc>
				<lastmod>${new Date().toISOString()}</lastmod>
			</url>`,
    )
    .join("\n");

  return new Response(
    `
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
		>
			${urls}
		</urlset>`.trim(),
    {
      headers: {
        "Content-Type": "application/xml",
      },
    },
  );
}
