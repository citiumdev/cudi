"use client";

import { User } from "@/types/User";
import { Event } from "@/types/Event";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Pencil, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { registerUserToEvent, unregisterUserFromEvent } from "@/actions/events";

interface Props {
  event: Event;
  presenters: Omit<User, "email">[];
}

export default function EventCard({ event, presenters }: Props) {
  const { data: session } = useSession();
  const [isRegistered, setIsRegistered] = useState(false);

  const parsedDate = new Date(event.date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h12",
  });

  const handleRegister = async () => {
    const { success } = await registerUserToEvent(event.id);

    if (success) {
      setIsRegistered(true);
      toast("Inscripción exitosa", {
        description: "Te has inscrito en el evento",
      });
    } else {
      toast("Error", {
        description: "Hubo un error al inscribirte en el evento",
      });
    }
  };

  const handleUnregister = async () => {
    const { success } = await unregisterUserFromEvent(event.id);

    if (success) {
      setIsRegistered(false);
      toast("Baja exitosa", {
        description: "Te has dado de baja del evento",
      });
    } else {
      toast("Error", {
        description: "Hubo un error al darte de baja del evento",
      });
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-md dark:bg-neutral-900">
      {session && session.user.role === "admin" ? (
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-2 top-2 z-10 rounded-full"
          asChild
        >
          <a href={`/dashboard/events/${event.id}`}>
            <Pencil />
          </a>
        </Button>
      ) : null}

      <div className="relative aspect-square w-full">
        <img
          src={event.image}
          alt={event.name}
          className="absolute h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
          {event.name}
        </h2>
        <div className="flex items-center gap-2 text-neutral-400">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{parsedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Users className="h-4 w-4" />
          <span className="text-sm">
            {event.limit
              ? `Hasta ${event.limit} participantes`
              : "Sin límite de participantes"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{event.duration} horas</span>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {event.type === "workshop" ? (
            <>
              <h3 className="font-bold text-neutral-800 dark:text-neutral-100">
                Presentadores
              </h3>
              <div className="flex flex-wrap gap-2">
                {[...presenters].map((presenter) => (
                  <div
                    key={presenter.id}
                    className="flex items-center gap-2 rounded-full bg-neutral-800 p-1 pr-2"
                  >
                    <Avatar className="size-6">
                      <AvatarImage src={presenter.image} />
                      <AvatarFallback>{presenter.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-bold">{presenter.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          <div className="mt-auto flex w-full flex-col gap-2 pt-4">
            <p className="text-sm text-neutral-400">
              {event.done
                ? "El evento ya se realizó"
                : event.active
                  ? isRegistered
                    ? "Ya estás inscrito"
                    : "Inscríbete en este evento"
                  : "Aún no disponible"}
            </p>
            <Button
              disabled={event.done || !event.active}
              onClick={isRegistered ? handleUnregister : handleRegister}
              variant={isRegistered && !event.done ? "destructive" : "default"}
            >
              {event.done
                ? "Evento realizado"
                : event.active
                  ? isRegistered
                    ? "Darse de baja"
                    : "Inscribirse"
                  : "Evento no activo"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
