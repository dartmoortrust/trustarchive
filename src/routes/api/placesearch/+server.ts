import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import sharp from "sharp";
import { db } from "$lib/server/db";

export const GET: RequestHandler = async ({ url }) => {
  // 1. Get query parameters
  try {
    const q = url.searchParams.get("q");
    let locations = await db.query(`
      SELECT name1, ST_asGeoJSON(geom)::json->'coordinates' as coords
      FROM devonplaces
      WHERE name1 ilike $1
      limit 10
    `,[`%${q}%`])
    console.log(locations.rows)
    return json(locations.rows)
    
  } catch (err) {
    console.error("Location search error:", err);
    throw error(500, "Location search error");
  }
};
