"use server";

import { db, users } from "@/database";
import { User, userSchema } from "@/types/User";
import { authAction } from "@/utils/authAction";
import { eq } from "drizzle-orm";

export const getPresenters = authAction(async (): Promise<User[]> => {
  const admins = await db.select().from(users).where(eq(users.role, "admin"));
  const parsedAdmins = userSchema.array().parse(admins);

  return parsedAdmins;
}, "admin");
