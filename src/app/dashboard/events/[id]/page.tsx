import EditEventForm from "@/components/dashboard/EditEventForm";
import EventParticipants from "@/components/dashboard/EventParticipants";
import { db, events, presenters, users } from "@/database";
import { eventSchema } from "@/types/Event";
import { userSchema } from "@/types/User";
import { eq } from "drizzle-orm";
import { z } from "zod";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rows = await db
    .select({
      event: events,
      presenter: users,
    })
    .from(events)
    .leftJoin(presenters, eq(events.id, presenters.eventId))
    .leftJoin(users, eq(users.id, presenters.userId))
    .where(eq(events.id, id))
    .all();

  type DBEvent = typeof events.$inferSelect;
  type DBUser = typeof users.$inferSelect;

  const result = rows.reduce<
    | {
        event: DBEvent;
        presenters: DBUser[];
      }
    | undefined
  >((acc, row) => {
    const rowEvent = row.event;
    const rowPresenter = row.presenter;

    if (!acc) {
      acc = { event: rowEvent, presenters: [] };
    }

    if (rowPresenter) {
      acc.presenters.push(rowPresenter);
    }

    return acc;
  }, undefined);

  const schema = z.object({
    event: eventSchema,
    presenters: z.array(userSchema),
  });

  const parsedEvent = schema.parse(result);

  const admins = await db.select().from(users).where(eq(users.role, "admin"));
  const parsedAdmins = userSchema.array().parse(admins);

  return (
    <div className="container mx-auto flex max-w-6xl flex-col">
      <EditEventForm
        event={parsedEvent.event}
        presenters={parsedEvent.presenters}
        presentersOptions={parsedAdmins}
      />
      <div className="grid w-full grid-cols-1">
        <EventParticipants event={parsedEvent.event} />
      </div>
    </div>
  );
}
