import { z } from "zod";
import { userSchema } from "./User";
import { eventSchema } from "./Event";

export const certificateSchema = z.object({
  id: z.string(),
  user: userSchema,
  event: eventSchema,
  presenters: z.array(userSchema),
});

export type Certificate = z.infer<typeof certificateSchema>;
