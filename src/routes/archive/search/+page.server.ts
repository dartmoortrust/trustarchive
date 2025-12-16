import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";
import pkg from "pg-tsquery";
const { Tsquery } = pkg;

// --- Constants ---
const DEFAULT_PER_PAGE = 25;

// --- Types ---

interface SearchResult {
  id: string;
  title: string;
  detail: string;
  caption_front: string;
  file_mime: string;
  sha1_hash: string;
  transform: string;
  full_count: number;
  rank: number;
}

interface Pagination {
  page: number;
  per_page: number;
  total_count: number;
  page_count: number;
  q: string;
}

// --- Page Load Function ---

export const load: PageServerLoad = async ({ url }) => {
  // Use nullish coalescing for cleaner default handling
  const rawQ = url.searchParams.get("q")?.trim() ?? "";
  const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);
  const per_page = Math.max(
    Number(url.searchParams.get("per_page")) || DEFAULT_PER_PAGE,
    1,
  );

  // Early return if no search query
  if (!rawQ) {
    return {
      results: [],
      pagination: {
        page,
        per_page,
        total_count: 0,
        page_count: 0,
        q: "",
      } satisfies Pagination,
    };
  }

  try {
    const q = rawQ.toLowerCase(); // Consistent case for case-insensitive operations

    // 1. Separate Parsing Concerns
    const parsedQuery = parseSearchQuery(q); // For tsquery
    const trigramQuery = cleanTrigramQuery(q); // For similarity operators

    // Handles cases where parsing fails or results in an empty query.
    if (!parsedQuery || !trigramQuery) {
      return {
        results: [],
        pagination: {
          page,
          per_page,
          total_count: 0,
          page_count: 0,
          q,
        } satisfies Pagination,
      };
    }

    const offset = (page - 1) * per_page;
    const results = await executeSearch(
      parsedQuery,
      trigramQuery,
      offset,
      per_page,
    );

    // Use nullish coalescing for safer count retrieval
    const total_count = results[0]?.full_count ?? 0;
    const page_count = Math.ceil(total_count / per_page);

    return {
      results,
      pagination: {
        page,
        per_page,
        total_count,
        page_count,
        q,
      } satisfies Pagination,
    };
  } catch (error) {
    console.error("Error executing search:", error);
    // Return a clearer error object to the frontend
    return {
      results: [],
      pagination: {
        page,
        per_page,
        total_count: 0,
        page_count: 0,
        q: rawQ,
      } satisfies Pagination,
      error: "An unexpected error occurred while searching. Please try again.",
    };
  }
};

/**
 * Parses the raw query string into a PostgreSQL tsquery string.
 */
function parseSearchQuery(query: string): string | null {
  try {
    const parser = new Tsquery();
    const parsed = parser.parse(query);

    // Ensure the resulting query is not empty (e.g., if user only enters stop words)
    const result = parsed?.toString();
    return result?.trim() ? result : null;
  } catch (error) {
    console.error("Error parsing search query:", error);
    return null;
  }
}

/**
 * Cleans the query for use with PostgreSQL trigram operators (%).
 */
function cleanTrigramQuery(query: string): string | null {
  // Removes PostgreSQL tsquery operators, non-alphanumeric, and extra whitespace
  const cleaned = query
    .replace(/[&|!():*<>{}\[\]=+\-@#$^*]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 0 ? cleaned : null;
}

async function executeSearch(
  parsedQuery: string,
  trigramQuery: string,
  offset: number,
  limit: number,
): Promise<SearchResult[]> {
  // Parameter mapping:
  // $1: parsedQuery (for to_tsquery and ts @@)
  // $2: trigramQuery (for similarity and % operators)
  // $3: offset
  // $4: limit

  const { rows } = await db.query<SearchResult>(
    `WITH search_results AS (
      SELECT 
        id, 
        title, 
        detail, 
        caption_front, 
        mime_type as file_mime, 
        sha1_hash, 
        transform,
        -- Full Text Search Rank
        ts_rank_cd(ts, to_tsquery('english', $1), 32) as exact_rank,
        
        -- Trigram Similarity Score (Combined and Weighted)
        (
          similarity(COALESCE(title, ''), $2) * 3 +
          similarity(COALESCE(detail, ''), $2) * 2 +
          similarity(COALESCE(caption_front, ''), $2) * 1.5
        ) / 6.5 as combined_similarity,
        
        -- Boolean check for an exact FTS match (boost results that matched FTS)
        CASE 
          WHEN ts @@ to_tsquery('english', $1) THEN 1
          ELSE 0
        END as has_exact_match
      FROM files
      WHERE 
        -- Only include rows that have at least one match method
        ts @@ to_tsquery('english', $1)    -- FTS Match
        OR title % $2                     -- Trigram Match (title)
        OR detail % $2                    -- Trigram Match (detail)
        OR caption_front % $2             -- Trigram Match (caption)
    )
    SELECT 
      *,
      count(*) OVER()::int AS full_count,
      -- Final Ranking: Tune the weights for desired relevance
      -- Current weights: FTS Exact Match (3) > FTS Rank (2) > Trigram Similarity (1.5)
      (exact_rank * 2 + combined_similarity * 1.5 + has_exact_match * 3) as rank
    FROM search_results
    ORDER BY rank DESC
    OFFSET $3
    LIMIT $4`,
    [parsedQuery, trigramQuery, offset, limit],
  );

  return rows;
}
