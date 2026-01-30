
export async function GET() {
    const pages = await Bun.sql`SELECT id from files order by id asc`
    console.log(pages)
	return new Response(
		`
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="http://www.w3.org/1999/xhtml"
			xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
		>
			${pages.map((page:any) => `
            <url>
                <loc>/archive/record/${page.id}</loc>
                <changefreq>yearly</changefreq>
            </url>
            `).join('')}
		</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}