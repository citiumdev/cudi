import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string(),
  role: z.union([z.literal("user"), z.literal("admin")]),
});

export type User = z.infer<typeof userSchema>;
