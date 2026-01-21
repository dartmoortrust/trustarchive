import z from "zod";

export const recordSchema = z.object({
  id: z.uuid(),
  title: z
    .string()
    .min(10, { error: "Title must be longer than 10 characters" })
    .max(200, { error: "Title must be shorter than 200 characters." }),
  medium: z.string().default("image"),
  sha1_hash: z.string().optional(),
  detail: z
    .string()
    .max(5000)
    .refine((val) => val === "" || val.length >= 50, {
      message: "Details should be either empty or at least 50 characters long",
    })
    .transform((val) => (val === "" ? null : val)),
  caption_front: z.string().transform((val) => (val === "" ? null : val)),
  caption_back: z.string().transform((val) => (val === "" ? null : val)),
  notes: z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  date_day: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = typeof val === "string" ? Number(val) : val;
    return isNaN(num) ? null : num;
  }, z.number().int().min(1).max(31).nullable()),
  date_month: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = typeof val === "string" ? Number(val) : val;
    return isNaN(num) ? null : num;
  }, z.number().int().min(1).max(12).nullable()),
  date_year: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = typeof val === "string" ? Number(val) : val;
    return isNaN(num) ? null : num;
  }, z.number().int().min(1900).max(new Date().getFullYear()).nullable()),
  date_estimated: z.boolean().default(false),
  transform: z.string(),
  location_geom: z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  location_name: z.string(),
  location_estimated: z.boolean().default(false),
  original_id: z.string(),
  mime_type: z.string().optional(),
});

export type Record = z.infer<typeof recordSchema>;
