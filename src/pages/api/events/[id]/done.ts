import { authMiddleware } from "@/utils/authMiddleware";
import {
  and,
  certificate,
  db,
  eq,
  event,
  eventParticipants,
  isNull,
} from "astro:db";

export const POST = authMiddleware({
  admin: true,
  handler: async ({ params }) => {
    const id = params.id as string;

    try {
      const participantsWithoutCertificate = await db
        .select({ eventParticipants })
        .from(eventParticipants)
        .leftJoin(
          certificate,
          and(
            eq(certificate.userId, eventParticipants.userId),
            eq(certificate.eventId, eventParticipants.eventId),
          ),
        )
        .where(and(eq(eventParticipants.eventId, id), isNull(certificate.id)));

      await db.batch([
        db.update(event).set({ done: true }).where(eq(event.id, id)),
        db.insert(certificate).values(
          participantsWithoutCertificate.map(
            ({ eventParticipants: { userId, eventId } }) => ({
              userId,
              eventId,
            }),
          ),
        ),
      ]);

      return new Response(
        JSON.stringify({
          message: "Event marked as done",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    } catch (error) {
      console.log(error);

      return new Response(
        JSON.stringify({ message: "Error marking event as done" }),
        {
          status: 500,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    }
  },
});
