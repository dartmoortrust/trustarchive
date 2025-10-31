import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, cookies }) => {
  try {
    const q = url.searchParams.get("q")?.trim() || "";
    const page = Number(url.searchParams.get("page")) || 1; // Ensure page is at least 1
    const per_page = Number(url.searchParams.get("per_page")) || 25;
    const offset = (page - 1) * per_page;

    // Early return if no search query
    if (!q)
      return {
        results: [],
        pagination: { page, per_page, total_count: 0, page_count: 0, q: "" },
      };

    const { rows: results } = await db.query(
      `
      SELECT f.id, f.mime_type, f.title, fm.medium, COUNT(*) OVER() AS full_count, paradedb.score(f.id)
      FROM files f
      JOIN file_mimes fm
      on f.mime_type = fm.mime_type
      WHERE f.id @@@ paradedb.boolean(
        should => ARRAY[
          paradedb.match(field => 'title', value => $1, distance => 2),
          paradedb.match(field => 'detail', value => $1, distance => 2),
          paradedb.match(field => 'ai_markdown', value => $1, distance => 1),
          paradedb.match(field => 'caption_front', value => $1, distance => 1),
          paradedb.match(field => 'caption_back', value => $1, distance => 1)

        ]
      )
      ORDER BY paradedb.score(f.id) DESC
      limit $2;
    `,
      [q, per_page],
    );

    const total_count = results[0]?.full_count || 0;
    const page_count = Math.ceil(total_count / per_page);
    const pagination = { page, per_page, total_count, page_count, q };

    return {
      results,
      pagination,
    };
  } catch (error) {
    console.error("Error loading search:", error);
    return {
      results: [],
      pagination: { page: 1, per_page: 25, total_count: 0, page_count: 0 },
    };
  }
};
