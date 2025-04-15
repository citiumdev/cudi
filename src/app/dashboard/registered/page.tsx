import { authConfig } from "@/auth";
import EventCard from "@/components/EventCard";
import { db, events, participants, presenters, users } from "@/database";
import { eventSchema } from "@/types/Event";
import { userSchema } from "@/types/User";
import { eq } from "drizzle-orm";
import { getServerSession, Session } from "next-auth";
import { z } from "zod";

export default async function RegisteredPage() {
  const session = (await getServerSession(authConfig)) as Session;
  const user = session.user!;

  const rows = await db
    .select()
    .from(participants)
    .innerJoin(events, eq(events.id, participants.eventId))
    .leftJoin(presenters, eq(events.id, presenters.eventId))
    .leftJoin(users, eq(users.id, presenters.userId))
    .where(eq(participants.userId, user.id))
    .all();

  type DBEvent = typeof events.$inferSelect;
  type DBUser = typeof users.$inferSelect;

  const result = rows.reduce<
    Record<
      string,
      {
        event: DBEvent;
        presenters: Record<string, DBUser>;
        participantsId: Set<string>;
      }
    >
  >((acc, row) => {
    const rowEvent = row.event;
    const rowPresenter = row.user;
    const rowParticipant = row.participant;

    if (!acc[rowEvent.id]) {
      acc[rowEvent.id] = {
        event: rowEvent,
        presenters: {},
        participantsId: new Set(),
      };
    }

    if (rowPresenter) {
      acc[rowEvent.id].presenters[rowPresenter.id] = rowPresenter;
    }

    acc[rowEvent.id].participantsId.add(rowParticipant.userId);

    return acc;
  }, {});

  const schema = z
    .object({
      event: eventSchema,
      presenters: z.array(userSchema),
      participantsId: z.string().array(),
    })
    .array();

  const parsed = schema.parse(
    Object.values(result).map((r) => ({
      event: r.event,
      presenters: Object.values(r.presenters),
      participantsId: [...r.participantsId],
    })),
  );

  return (
    <div className="@container">
      <h1 className="mb-6 text-2xl font-semibold">Eventos inscritos</h1>
      {parsed.length === 0 ? (
        <p className="text-lg text-neutral-500">
          No tienes eventos inscritos aún.
        </p>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-6 @xl:grid-cols-2 @4xl:grid-cols-3 @7xl:grid-cols-4">
          {parsed.map((e) => (
            <EventCard
              key={e.event.id}
              event={e.event}
              presenters={e.presenters}
            />
          ))}
        </div>
      )}
    </div>
  );
}
