import * as v from 'valibot';

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
  
  // Date fields simplified: Allow string/null, transform empty strings to null
  date_day: v.nullable(
    v.pipe(
      v.union([v.string(), v.number()]),
      v.transform(val => (val === '' || val === 'unknown' ? null : val)),
      v.nullable(v.pipe(v.any(), v.toNumber(), v.minValue(1), v.maxValue(31)))
    )
  ),
  date_month: v.nullable(
    v.pipe(
      v.union([v.string(), v.number()]),
      v.transform(val => (val === '' || val === 'unknown' ? null : val)),
      v.nullable(v.pipe(v.any(), v.toNumber(), v.minValue(1), v.maxValue(12)))
    )
  ),
  date_year: v.optional(
    v.pipe(
      v.union([v.string(), v.number()]),
      v.transform(val => (val === '' || val === 'unknown' ? null : val)),
      v.nullable(v.pipe(v.any(), v.toNumber(), v.minValue(1800), v.maxValue(2026)))
    )
  ),

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
  notes: v.string(),

  // GEOHASH FIX: Explicitly allow null for your "Remove Marker" logic
  geohash: v.nullable(v.pipe(
      v.union([v.string(), v.null()]),
      v.transform(val => (val === '' || val === 'unknown' ? null : val)),
    )), 
  location_name: v.optional(v.string(), "")
});