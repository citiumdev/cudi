import { db, events } from "@/database";
import { eventSchema } from "@/types/Event";
import { desc } from "drizzle-orm";
import EventCard from "./EventCard";

export default async function Events() {
  const rows = await db
    .select()
    .from(events)
    .orderBy(events.done, desc(events.active), events.date)
    .limit(3);

  const result = eventSchema.array().safeParse(rows);
  const parsed = result.success ? result.data : [];

  return (
    <section
      id="events"
      className="container mx-auto mb-40 flex min-h-screen max-w-6xl items-center px-2 py-32"
    >
      <div className="flex w-full flex-col p-4">
        <h1 className="mb-4 text-6xl font-bold">Eventos</h1>
        <p className="leading-loose">
          Organizamos una variedad de eventos diseñados para inspirar, educar y
          conectar a nuestra comunidad de programadores universitarios. Desde
          talleres y hackathons hasta conferencias y meetups. Mantente al tanto
          de nuestros próximos eventos y no te pierdas la oportunidad de ser
          parte de una comunidad dinámica y en constante crecimiento. Consulta
          el calendario a continuación y únete a nosotros en nuestras próximas
          actividades. ¡Te esperamos!
        </p>
        {parsed.length ? (
          <div className="mt-4 grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {parsed.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
            <a
              href="/dashboard"
              className="flex h-full w-full items-center justify-center rounded-md bg-neutral-900 px-4 py-6 text-neutral-100 transition-all hover:bg-neutral-800/70"
            >
              <span className="text-sm font-bold">Ver todos los eventos</span>
            </a>
          </div>
        ) : (
          <div className="mt-4 flex h-96 items-center justify-center rounded-lg bg-chetwode-500/10 p-4">
            <h2 className="text-2xl font-bold">Proximamente... ;)</h2>
          </div>
        )}
      </div>
    </section>
  );
}
