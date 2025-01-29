import { eventSchema } from "@/types/event";
import { authMiddleware } from "@/utils/authMiddleware";
import { deleteEventImage } from "@/utils/uploads";
import {
  db,
  eq,
  event,
  eventPresenters,
  eventParticipants,
  certificate,
} from "astro:db";
import { z } from "zod";

export const DELETE = authMiddleware({
  admin: true,
  handler: async ({ params }) => {
    const id = params.id as string;

    try {
      const results = await db.batch([
        db.delete(eventParticipants).where(eq(eventParticipants.eventId, id)),
        db.delete(eventPresenters).where(eq(eventPresenters.eventId, id)),
        db.delete(certificate).where(eq(certificate.eventId, id)),
        db.delete(event).where(eq(event.id, id)).returning(),
      ]);

      deleteEventImage({
        url: results[3][0].image,
      });

      return new Response(
        JSON.stringify({
          message: "Event deleted",
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

      return new Response(JSON.stringify({ message: "Error deleting event" }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      });
    }
  },
});

export const PUT = authMiddleware({
  admin: true,
  handler: async ({ params, request }) => {
    const id = params.id as string;
    const body = await request.json();

    const result = eventSchema
      .pick({
        name: true,
        date: true,
        duration: true,
        limit: true,
      })
      .extend({
        presenters: z.string().email().array(),
      })
      .safeParse({
        ...body,
        date: body.date ? new Date(body.date).valueOf() : undefined,
      });

    if (!result.success) {
      return new Response(
        JSON.stringify({
          message: "Error parsing event data",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    }

    try {
      const { data } = result;

      await db
        .update(event)
        .set({
          name: data.name,
          date: data.date,
          duration: data.duration,
          limit: data.limit,
        })
        .where(eq(event.id, id));

      return new Response(
        JSON.stringify({
          message: "Event updated",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    } catch (e) {
      console.log(e);

      return new Response(JSON.stringify({ message: "Error deleting event" }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      });
    }
  },
});
