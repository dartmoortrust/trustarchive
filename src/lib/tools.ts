import { goto } from "$app/navigation";
import { page } from "$app/state";
import { decodeBase32, encodeBase32 } from "geohashing";
import pkg from "pg-tsquery";
const { Tsquery } = pkg;

export const changeUrl = (params: object) => {
  // 1. Create a copy of existing params
  const newParams = new URLSearchParams(page.url.searchParams);

  // 2. Efficiently update params
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      newParams.delete(key); // Clean up the URL if value is null/undefined
    } else {
      newParams.set(key, String(value));
    }
  });

  const queryString = newParams.toString();
  const search = queryString ? `?${queryString}` : "";

  // 3. Navigate
  goto(search || window.location.pathname, {
    keepFocus: true,
    replaceState: true,
    noScroll: true,
  });
};

export const parseSearchQuery = (query: string): string | null => {
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
};

/**
 * Cleans the query for use with PostgreSQL trigram operators (%).
 */
export const cleanTrigramQuery = (query: string): string | null => {
  // Removes PostgreSQL tsquery operators, non-alphanumeric, and extra whitespace
  const cleaned = query
    .replace(/[&|!():*<>{}\[\]=+\-@#$^*]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 0 ? cleaned : null;
};

export const geohashToLatLng = (hash:string) => {
  if(hash)  return decodeBase32(hash)
    return null
};

export const latLngToGeohash = (lat:number, lng:number) => {
  if(lat && lng)  return encodeBase32(lat, lng)
    return null
};