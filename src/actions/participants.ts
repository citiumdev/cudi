"use server";

import { authConfig } from "@/auth";
import { certificates, db, participants, users } from "@/database";
import { Event } from "@/types/Event";
import { createPaginationSchema } from "@/types/Pagination";
import { userSchema } from "@/types/User";
import { authAction } from "@/utils/authAction";
import { and, count, eq } from "drizzle-orm";
import { getServerSession, Session } from "next-auth";
import { z } from "zod";

const schema = createPaginationSchema(
  z.object({
    user: userSchema,
    certificate: z.string().nullable(),
  }),
);

export const getParticipants = authAction(
  async ({
    id,
    limit = 10,
    page = 0,
  }: {
    id: Event["id"];
    limit?: number;
    page?: number;
  }) => {
    const result = await db
      .select({ count: count(), user: users, certificate: certificates })
      .from(participants)
      .innerJoin(users, eq(users.id, participants.userId))
      .leftJoin(
        certificates,
        and(
          eq(certificates.userId, participants.userId),
          eq(certificates.eventId, participants.eventId),
        ),
      )
      .where(eq(participants.eventId, id))
      .limit(limit)
      .offset(page * limit);

    const parsed =
      result.length && result[0].count
        ? result.map((data) => ({
            user: data.user,
            certificate: data.certificate?.id || null,
          }))
        : [];

    const total = result.length ? result[0].count : 0;

    return schema.parse({
      data: parsed,
      limit,
      page,
      pageSize: parsed.length,
      total,
    });
  },
  "admin",
);

export const currentUserIsRegistered = authAction(async (id: Event["id"]) => {
  const session = (await getServerSession(authConfig)) as Session;

  const result = await db
    .select()
    .from(participants)
    .where(
      and(
        eq(participants.eventId, id),
        eq(participants.userId, session.user.id),
      ),
    )
    .get();

  return !!result;
});
