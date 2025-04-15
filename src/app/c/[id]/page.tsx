import Gradient from "@/components/Gradient";
import { db, certificates, events, presenters, users } from "@/database";
import { certificateSchema } from "@/types/Certificate";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import CertificatePageClient from "@/components/certificate/CertificatePage";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const presenter = alias(users, "presenterUser");

  const rows = await db
    .select({
      id: certificates.id,
      event: events,
      user: users,
      presenter,
    })
    .from(certificates)
    .innerJoin(events, eq(events.id, certificates.eventId))
    .innerJoin(users, eq(users.id, certificates.userId))
    .leftJoin(presenters, eq(events.id, presenters.eventId))
    .leftJoin(presenter, eq(presenter.id, presenters.userId))
    .where(eq(certificates.id, id as string));

  type DBEvent = typeof events.$inferSelect;
  type DBUser = typeof users.$inferSelect;

  const result = rows.reduce<
    | {
        id: string;
        event: DBEvent;
        user: DBUser;
        presenters: DBUser[];
      }
    | undefined
  >((acc, row) => {
    const rowEvent = row.event;
    const rowUser = row.user;
    const rowPresenter = row.presenter;

    if (!acc) {
      acc = {
        event: rowEvent,
        presenters: [],
        user: rowUser,
        id: row.id,
      };
    }

    if (rowPresenter) {
      acc.presenters.push(rowPresenter);
    }

    return acc;
  }, undefined);

  const parsed = certificateSchema.safeParse(result);

  if (!parsed.success) {
    return (
      <main className="flex h-screen items-center justify-center">
        <Gradient />
        <h1 className="text-2xl font-bold">El certificado no existe</h1>
      </main>
    );
  }

  return <CertificatePageClient certificate={parsed.data} />;
}
