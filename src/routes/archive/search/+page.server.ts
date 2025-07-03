import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";
import pkg from "pg-tsquery";
const { Tsquery } = pkg;

export const load: PageServerLoad = async ({ url, cookies }) => {
  try {
    const q = url.searchParams.get("q")?.trim() || ""; // Handle empty string case
    const page = Math.max(Number(url.searchParams.get("page")) || 1, 1); // Ensure page is at least 1
    const per_page = Math.max(
      Number(url.searchParams.get("per_page")) || 25,
      1,
    ); // Ensure per_page is at least 1

    const timestamp = Date.now();
    let oldcookies = cookies.get("search_history");
    const searchHistory = oldcookies ? JSON.parse(oldcookies) : [];

    // Update search history if a valid query exists
    if (q) {
      searchHistory.push({ timestamp, q });
      cookies.set("search_history", JSON.stringify(searchHistory), {
        path: "/archive/search",
        httpOnly: false, // Enhance security
        sameSite: "strict", // Prevent CSRF attacks
      });
    }

    // Early return if no search query
    if (!q)
      return {
        results: [],
        pagination: { page, per_page, total_count: 0, page_count: 0 },
        history: searchHistory,
      };

    const parser = new Tsquery();
    const parsed = parser.parse(q)?.toString() || ""; // Handle potential null value
    const offset = (page - 1) * per_page;

    const { rows: results } = await db.query(
      `SELECT id, title, detail, caption, file_mime, file_id, image_transform, 
              count(*) OVER()::int AS full_count,
              (ts_rank(ts, to_tsquery('english', $1)) * 0.7 + 
               similarity(COALESCE(title, '') || ' ' || COALESCE(detail, '') || ' ' || COALESCE(caption, ''), $2) * 0.3) AS combined_rank
       FROM records
       WHERE (ts @@ to_tsquery('english', $1) OR 
              similarity(COALESCE(title, '') || ' ' || COALESCE(detail, '') || ' ' || COALESCE(caption, ''), $2) > 0.2)
             AND public = true
       ORDER BY combined_rank DESC
       OFFSET $3
       LIMIT $4
      `,
      [parsed, q, offset, per_page],
    );

    const total_count = results[0]?.full_count || 0;
    const page_count = Math.ceil(total_count / per_page);

    const pagination = { page, per_page, total_count, page_count, q };

    return {
      results,
      pagination,
      history: searchHistory,
    };
  } catch (error) {
    console.error("Error loading search:", error);
    return {
      results: [],
      pagination: { page: 1, per_page: 25, total_count: 0, page_count: 0 },
      history: [],
    };
  }
};
