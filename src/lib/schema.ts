import * as v from 'valibot';

// Helper for coercion that avoids 'null' in the input type
const coerceNumber = v.pipe(
  v.union([v.string(), v.number()]), // Removed v.null() from here
  v.transform(val => (val === '' || val === 'unknown' ? undefined : Number(val))),
  v.optional(v.number()) // Changed to optional
);

export const recordSchema = v.object({
  id: v.string(),
  title: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(10, "Title must be at least 10 characters"),
    v.maxLength(200, "Titles must not be longer than 200 characters")
  ),
  caption_front: v.string(),
  caption_back: v.string(),
  original_id: v.string(),
  
  // Use optional() to satisfy RemoteFormInput types
  date_day: v.pipe(coerceNumber, v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(31)))),
  date_month: v.pipe(coerceNumber, v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(12)))),
  date_year: v.pipe(coerceNumber, v.optional(v.pipe(v.number(), v.minValue(1800), v.maxValue(2026)))),

  transform: v.object({
    r: v.optional(v.number(), 0),
    flip: v.optional(v.boolean(), false),
    flop: v.optional(v.boolean(), false),
    n: v.optional(v.boolean(), false),
  }),
  date_estimated: v.optional(v.boolean(), false),
  detail: v.string(),
  public: v.optional(v.boolean(), false),
  downloadable: v.optional(v.boolean(), false),
  notes: v.optional(v.string(), ""),

  // GEOHASH: Changed to optional string
  geohash: v.pipe(
    v.optional(v.string()), 
    v.transform(val => (val === '' || val === 'unknown' ? undefined : val))
  ),
  location_name: v.optional(v.string(), "")
});