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
      const currentEvent = await db
        .select()
        .from(event)
        .where(eq(event.id, id))
        .get();

      if (!currentEvent) {
        return new Response(JSON.stringify({ message: "Event not found" }), {
          status: 404,
          headers: {
            "content-type": "application/json",
          },
        });
      }

      if (currentEvent.done) {
        return new Response(
          JSON.stringify({ message: "Event already marked as done" }),
          {
            status: 400,
            headers: {
              "content-type": "application/json",
            },
          },
        );
      }

      if (!currentEvent.active) {
        return new Response(
          JSON.stringify({ message: "Event is not active" }),
          {
            status: 400,
            headers: {
              "content-type": "application/json",
            },
          },
        );
      }

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
