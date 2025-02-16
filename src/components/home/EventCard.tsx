"use client";

import type { Event } from "@/types/Event";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const parsedDate = new Date(event.date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h12",
  });

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-md dark:bg-neutral-900">
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

        <div className="mt-auto flex w-full flex-col gap-2 pt-4">
          <Button asChild>
            <a href="/dashboard">Ver detalles</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
