import z from "zod";

export const recordSchema = z.object({
  id: z.uuid(),
  title: z.string().min(10, {error: "Title must be longer than 10 characters"}).max(200, {error: "Title must be shorter than 200 characters."}),
  medium: z.string().default('image'),
  sha1_hash: z.string(),
  detail: z.string().max(5000).optional().transform((val) => (val === "" ? null : val)),
  caption_front: z.string().transform((val) => (val === "" ? null : val)),
  caption_back: z.string().transform((val) => (val === "" ? null : val)),
  notes: z.string().optional().transform((val) => (val === "" ? null : val)),
  date_day: z.string().transform((val) => (val === "" ? null : Number(val))),
  date_month: z.string().transform((val) => (val === "" ? null : Number(val))),
  date_year: z.string().transform((val) => (val === "" ? null : Number(val))),
  date_estimated: z.boolean().default(false),
  transform: z.string(),
  location_geom: z.string().optional().transform((val) => (val === "" ? null : val)),
  location_name: z.string(),
  location_estimated: z.boolean().default(false),
  original_id: z.string(),
  mime_type: z.string()
});

export type Record = z.infer<typeof recordSchema>;
