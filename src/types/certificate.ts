import { z } from "zod";
import { eventSchema } from "./event";
import { userSchema } from "./user";

export const certificateSchema = z.object({
  id: z.string(),
  user: userSchema,
  event: eventSchema,
});

export type Certificate = z.infer<typeof certificateSchema>;
