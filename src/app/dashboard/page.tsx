import { db, events, participants, presenters, users } from "@/database";
import { eq } from "drizzle-orm";
import { userSchema } from "@/types/User";
import { z } from "zod";
import { eventSchema } from "@/types/Event";
import EventCard from "@/components/EventCard";

export default async function Dashboard() {
  const rows = await db
    .select({
      event: events,
      participant: participants,
      presenter: users,
    })
    .from(events)
    .leftJoin(participants, eq(events.id, participants.eventId))
    .leftJoin(presenters, eq(events.id, presenters.eventId))
    .leftJoin(users, eq(users.id, presenters.userId))
    .where(eq(events.done, false))
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
    const rowPresenter = row.presenter;
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

    if (rowParticipant) {
      acc[rowEvent.id].participantsId.add(rowParticipant.userId);
    }

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
      <h1 className="mb-6 text-2xl font-semibold">Eventos disponibles</h1>
      <div className="grid flex-1 grid-cols-1 gap-6 @xl:grid-cols-2 @4xl:grid-cols-3 @7xl:grid-cols-4">
        {parsed.length ? (
          parsed.map((e) => (
            <EventCard
              key={e.event.id}
              event={e.event}
              presenters={e.presenters}
            />
          ))
        ) : (
          <p className="text-lg text-neutral-500">
            No hay eventos disponibles.
          </p>
        )}
      </div>
    </div>
  );
}
