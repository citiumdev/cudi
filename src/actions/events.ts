"use server";

import { authConfig } from "@/auth";
import {
  certificates,
  db,
  events,
  participants,
  presenters,
  users,
} from "@/database";
import { Event } from "@/types/Event";
import { authAction } from "@/utils/authAction";
import { deleteEventImage, uploadEventImage } from "@/utils/uploads";
import { and, count, eq, inArray, isNull } from "drizzle-orm";
import { getServerSession, Session } from "next-auth";
import { z } from "zod";

export const createWorkshop = authAction(async (formData: FormData) => {
  try {
    const body = Object.fromEntries(formData);

    const parsed = z
      .object({
        name: z.string(),
        image: z.instanceof(File),
        date: z.string(),
        duration: z.coerce.number(),
        limit: z.coerce.number().min(0).nullish(),
        presenters: z
          .string()
          .transform((value) => value.slice(2, -2).split(",")),
      })
      .parse(body);

    const { url } = await uploadEventImage({
      filename: crypto.randomUUID(),
      image: parsed.image,
      type: parsed.image.type.split("/")[1],
    });

    const eventResult = await db
      .insert(events)
      .values({
        name: parsed.name,
        image: url,
        date: new Date(parsed.date),
        duration: parsed.duration,
        limit: parsed.limit,
        type: "workshop",
      })
      .returning()
      .get();

    const presentersResult = await db
      .select()
      .from(users)
      .where(inArray(users.email, parsed.presenters));

    await db.insert(presenters).values(
      presentersResult.map((presenter) => ({
        eventId: eventResult.id,
        userId: presenter.id,
      })),
    );

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
    };
  }
}, "admin");

export const createTalk = authAction(async (formData: FormData) => {
  try {
    const body = Object.fromEntries(formData);

    const parsed = z
      .object({
        type: z.literal("talk"),
        name: z.string(),
        image: z.instanceof(File),
        date: z.string(),
        duration: z.coerce.number(),
      })
      .parse(body);

    const { url } = await uploadEventImage({
      filename: crypto.randomUUID(),
      image: parsed.image,
      type: parsed.image.type.split("/")[1],
    });

    await db
      .insert(events)
      .values({
        name: parsed.name,
        image: url,
        date: new Date(parsed.date),
        duration: parsed.duration,
        limit: 0,
        type: "talk",
      })
      .returning()
      .get();

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
    };
  }
}, "admin");

export const editEvent = authAction(
  async (data: Pick<Event, "id" | "name" | "date" | "duration" | "limit">) => {
    try {
      await db
        .update(events)
        .set({
          name: data.name,
          date: data.date,
          duration: data.duration,
          limit: data.limit,
        })
        .where(eq(events.id, data.id));

      return {
        success: true,
      };
    } catch (e) {
      console.error(e);
      return {
        success: false,
      };
    }
  },
  "admin",
);

export const deleteEvent = authAction(async (id: Event["id"]) => {
  try {
    const event = await db.delete(events).where(eq(events.id, id)).returning();

    deleteEventImage({
      url: event[0].image,
    });

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
    };
  }
}, "admin");

export const markEventAsActive = authAction(async (id: Event["id"]) => {
  try {
    const currentEvent = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .get();

    if (!currentEvent) {
      return {
        success: false,
      };
    }

    if (currentEvent.active) {
      return {
        success: false,
      };
    }

    await db.update(events).set({ active: true }).where(eq(events.id, id));

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
    };
  }
}, "admin");

export const markEventAsDone = authAction(async (id: Event["id"]) => {
  try {
    const currentEvent = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .get();

    if (!currentEvent) {
      return {
        success: false,
      };
    }

    if (currentEvent.done) {
      return {
        success: false,
      };
    }

    if (!currentEvent.active) {
      return {
        success: false,
      };
    }

    if (currentEvent.type === "workshop") {
      const participantsWithoutCertificate = await db
        .select({ participants })
        .from(participants)
        .leftJoin(
          certificates,
          and(
            eq(certificates.userId, participants.userId),
            eq(certificates.eventId, participants.eventId),
          ),
        )
        .where(and(eq(participants.eventId, id), isNull(certificates.id)));

      await db.batch([
        db.update(events).set({ done: true }).where(eq(events.id, id)),
        db.insert(certificates).values(
          participantsWithoutCertificate.map(
            ({ participants: { userId, eventId } }) => ({
              userId,
              eventId,
            }),
          ),
        ),
      ]);
    } else {
      await db.update(events).set({ done: true }).where(eq(events.id, id));
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}, "admin");

export const registerUserToEvent = authAction(async (id: Event["id"]) => {
  try {
    const session = (await getServerSession(authConfig)) as Session;

    const currentEvent = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .get();

    if (!currentEvent) {
      return {
        success: false,
      };
    }

    if (!currentEvent.active) {
      return {
        success: false,
      };
    }

    if (currentEvent.done) {
      return {
        success: false,
      };
    }

    const currentParticipants = await db
      .select({ count: count(), participant: participants })
      .from(participants)
      .where(eq(participants.eventId, id));

    if (
      currentEvent.limit &&
      currentParticipants.length &&
      currentParticipants[0].count >= currentEvent.limit
    ) {
      return {
        success: false,
      };
    }

    if (
      currentParticipants.some(
        ({ participant }) => participant.userId === session?.user?.id,
      )
    ) {
      return {
        success: false,
      };
    }

    await db.insert(participants).values({
      userId: session.user.id,
      eventId: id,
    });

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
    };
  }
});

export const unregisterUserFromEvent = authAction(async (id: Event["id"]) => {
  try {
    const session = (await getServerSession(authConfig)) as Session;

    await db
      .delete(participants)
      .where(
        and(
          eq(participants.eventId, id),
          eq(participants.userId, session.user.id),
        ),
      );

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
    };
  }
});
