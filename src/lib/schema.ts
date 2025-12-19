import z from "zod";

export const recordSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  medium: z.string(),
  sha1_hash: z.string(),
});

export type Record = z.infer<typeof recordSchema>;
