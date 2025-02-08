import { z } from "zod";
import { eventSchema } from "./event";
import { userSchema } from "./user";

export const certificateSchema = z.object({
  id: z.string(),
  user: userSchema,
  event: eventSchema,
  presenters: z.array(userSchema),
});

export type Certificate = z.infer<typeof certificateSchema>;
