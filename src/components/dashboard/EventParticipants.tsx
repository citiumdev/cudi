"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookCheck, Ellipsis, UserCheck } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Event } from "@/types/Event";
import { Fragment, useState } from "react";
import { getParticipants } from "@/actions/participants";
import { markEventAsActive, markEventAsDone } from "@/actions/events";

type Props = {
  event: Event;
};

export default function EventParticipants({ event }: Props) {
  const [isDone, setIsDone] = useState(event.done);
  const [isActive, setIsActive] = useState(event.active);

  const { data, status, refetch } = useInfiniteQuery({
    queryKey: ["eventParticipants", { eventId: event.id }],
    queryFn: async ({ pageParam }) =>
      await getParticipants({
        id: event.id,
        page: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: ({ total, pageSize, page }) => {
      return total - pageSize * (page + 1) > 0 ? page + 1 : undefined;
    },
  });

  const handleDone = async () => {
    const { success } = await markEventAsDone(event.id);

    if (success) {
      refetch();
      toast("Evento terminado", {
        description:
          "Se ha marcado el evento como terminado y se han otorgado los certificados",
      });
      setIsDone(true);
    } else {
      toast("Error", {
        description: "Ocurrió un error al terminar el evento",
      });
    }
  };

  const handleActive = async () => {
    const { success } = await markEventAsActive(event.id);

    if (success) {
      refetch();
      toast("Evento activado", {
        description:
          "Se ha habilitado el evento para que los participantes puedan ingresar",
      });
      setIsActive(true);
    } else {
      toast("Error", {
        description: "Ocurrió un error al activar el evento",
      });
    }
  };

  return (
    <div className="mt-8 flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-2xl font-bold">Participantes</h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isActive}
            onClick={() => handleActive()}
          >
            Activar Evento
            <UserCheck />
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!isActive || isDone}
            onClick={() => handleDone()}
          >
            Terminar Evento
            <BookCheck />
          </Button>
        </div>
      </div>
      {status === "pending" ? (
        <div className="border p-6 text-center text-sm">Cargando...</div>
      ) : status === "error" ? (
        <div className="border p-6 text-center text-sm text-red-500">
          Ocurrió un error cargando los participantes
        </div>
      ) : (
        <>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Certificado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.pages.map(({ data }, i) => (
                  <Fragment key={i}>
                    {data.length ? (
                      <>
                        {data.map(({ user, certificate }) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Avatar>
                                <AvatarImage src={user.image} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>
                              {certificate ? (
                                <div className="text-green-400">Otorgado</div>
                              ) : (
                                <div className="text-red-500">Pendiente</div>
                              )}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="outline">
                                    <Ellipsis />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {certificate ? (
                                    <DropdownMenuItem>
                                      Quitar Certificado
                                    </DropdownMenuItem>
                                  ) : null}
                                  <DropdownMenuItem>Remover</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-sm text-zinc-400"
                        >
                          No hay participantes.
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <Button size="sm" variant="outline" className="mt-4">
            Cargar más
          </Button>
        </>
      )}
    </div>
  );
}
