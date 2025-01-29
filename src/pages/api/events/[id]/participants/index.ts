import { authMiddleware } from "@/utils/authMiddleware";
import {
  and,
  certificate,
  count,
  db,
  eq,
  event,
  eventParticipants,
  user,
} from "astro:db";
import { getSession } from "auth-astro/server";

export const GET = authMiddleware({
  admin: true,
  handler: async ({ request, params }) => {
    const id = params.id as string;
    const queryParams = new URL(request.url).searchParams;

    const limit = parseInt(queryParams.get("limit") ?? "") || 10;
    const page = parseInt(queryParams.get("page") ?? "") || 0;

    const participants = await db
      .select({ count: count(), user, certificate })
      .from(eventParticipants)
      .innerJoin(user, eq(user.id, eventParticipants.userId))
      .leftJoin(
        certificate,
        and(
          eq(certificate.userId, eventParticipants.userId),
          eq(certificate.eventId, eventParticipants.eventId),
        ),
      )
      .where(eq(eventParticipants.eventId, id))
      .limit(limit)
      .offset(page * limit);

    const parsed =
      participants.length && participants[0].count
        ? participants.map((data) => ({
            user: data.user,
            certificate: data.certificate?.id || null,
          }))
        : [];

    const total = participants.length ? participants[0].count : 0;

    return new Response(
      JSON.stringify({
        data: parsed,
        limit,
        page,
        pageSize: parsed.length,
        total,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  },
});

export const POST = authMiddleware({
  admin: false,
  handler: async ({ request, params }) => {
    try {
      const session = await getSession(request);

      if (!session?.user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
          status: 401,
          headers: {
            "content-type": "application/json",
          },
        });
      }

      const id = params.id as string;

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

      const currentParticipants = await db
        .select({ count: count(), participant: eventParticipants })
        .from(eventParticipants)
        .where(eq(eventParticipants.eventId, id));

      if (
        currentEvent.limit &&
        currentParticipants.length &&
        currentParticipants[0].count >= currentEvent.limit
      ) {
        return new Response(JSON.stringify({ message: "Event is full" }), {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        });
      }

      if (
        currentParticipants.some(
          ({ participant }) => participant.userId === session?.user?.id,
        )
      ) {
        return new Response(
          JSON.stringify({ message: "Already participant" }),
          {
            status: 400,
            headers: {
              "content-type": "application/json",
            },
          },
        );
      }

      await db.insert(eventParticipants).values({
        userId: session.user.id,
        eventId: id,
      });

      return new Response(
        JSON.stringify({
          message: "Participant added",
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
        JSON.stringify({ message: "Error adding participant" }),
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

export const DELETE = authMiddleware({
  admin: false,
  handler: async ({ request, params }) => {
    const session = await getSession(request);

    if (!session?.user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    const id = params.id as string;

    try {
      await db
        .delete(eventParticipants)
        .where(
          and(
            eq(eventParticipants.eventId, id),
            eq(eventParticipants.userId, session.user.id),
          ),
        );

      return new Response(
        JSON.stringify({
          message: "Participant removed",
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
        JSON.stringify({ message: "Error removing participant" }),
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
