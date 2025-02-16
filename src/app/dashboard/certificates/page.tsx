import { authConfig } from "@/auth";
import { certificates, db, events, presenters, users } from "@/database";
import { certificateSchema } from "@/types/Certificate";
import { aliasedTable, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

import CertificateCard from "@/components/dashboard/CertificateCard";

export default async function CertificatesPage() {
  const session = await getServerSession(authConfig);
  const user = session?.user!;

  const presenterUser = aliasedTable(users, "presenterUser");

  const rows = await db
    .select({
      id: certificates.id,
      event: events,
      user: users,
      presenter: presenterUser,
    })
    .from(certificates)
    .innerJoin(events, eq(events.id, certificates.eventId))
    .innerJoin(users, eq(users.id, certificates.userId))
    .leftJoin(presenters, eq(events.id, presenters.eventId))
    .leftJoin(presenterUser, eq(presenterUser.id, presenters.userId))
    .where(eq(certificates.userId, user.id))
    .all();

  type DBEvent = typeof events.$inferSelect;
  type DBUser = typeof users.$inferSelect;

  const result = rows.reduce<
    Record<
      string,
      {
        id: string;
        event: DBEvent;
        user: DBUser;
        presenters: DBUser[];
      }
    >
  >((acc, row) => {
    const rowEvent = row.event;
    const rowUser = row.user;
    const rowPresenter = row.presenter;

    if (!acc[row.id]) {
      acc[row.id] = {
        event: rowEvent,
        presenters: [],
        user: rowUser,
        id: row.id,
      };
    }

    if (rowPresenter) {
      acc[row.id].presenters.push(rowPresenter);
    }

    return acc;
  }, {});

  const parsed = certificateSchema.array().parse(Object.values(result));

  return (
    <div className="@container">
      <h1 className="mb-6 text-2xl font-semibold">Tus certificados</h1>

      {parsed.length === 0 ? (
        <p className="text-lg text-neutral-500">No tienes certificados aún.</p>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-4 @3xl:grid-cols-2 @7xl:grid-cols-3">
          {parsed.map((c) => (
            <CertificateCard certificate={c} />
          ))}
        </div>
      )}
    </div>
  );
}
