import { z } from "zod";

export const eventSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  date: z.number(),
  duration: z.number(),
  done: z.boolean(),
  active: z.boolean(),
  limit: z.number().min(0).nullable(),
});

export type Event = z.infer<typeof eventSchema>;
