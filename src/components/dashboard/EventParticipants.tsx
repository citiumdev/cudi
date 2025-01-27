import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userSchema } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { z } from "zod";
import { Button } from "../ui/button";
import { BookCheck, Ellipsis } from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { createPaginationSchema } from "@/types/pagination";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryClient } from "@/store/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types/event";
import { useState } from "react";

type Props = {
  event: Event;
};

const schema = createPaginationSchema(
  z.object({
    user: userSchema,
    certificate: z.string().nullable(),
  }),
);

export default function EventParticipants({ event }: Props) {
  const { toast } = useToast();
  const [isDone, setIsDone] = useState(event.done);

  const { data, status, refetch } = useInfiniteQuery(
    {
      queryKey: ["eventParticipants", { eventId: event.id }],
      queryFn: async ({ pageParam }) => {
        const res = await fetch(
          `/api/events/${event.id}/participants?page=${pageParam}`,
        );

        const data = await res.json();

        const result = schema.parse(data);

        return result;
      },
      initialPageParam: 0,
      getNextPageParam: ({ total, pageSize, page }) => {
        return total - pageSize * (page + 1) > 0 ? page + 1 : undefined;
      },
    },
    queryClient,
  );

  const handleDone = async () => {
    const res = await fetch(`/api/events/${event.id}/done`, {
      method: "POST",
    });

    if (res.ok) {
      refetch();
      toast({
        title: "Evento terminado",
        description:
          "Se ha marcado el evento como terminado y se han otorgado los certificados",
      });
      setIsDone(true);
    } else {
      toast({
        title: "Error",
        description: "Ocurrió un error al terminar el evento",
      });
    }
  };

  return (
    <div className="mt-8 flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-2xl font-bold">Participantes</h2>
        <Button
          size="sm"
          variant="outline"
          disabled={isDone}
          onClick={() => handleDone()}
        >
          Terminar Evento
          <BookCheck />
        </Button>
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
                {data.pages.map(({ data }) => (
                  <>
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
                  </>
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
