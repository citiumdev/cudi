import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import { Slider } from "@/components/ui/slider";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import type { User } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types/event";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  date: z.coerce.date(),
  duration: z.number().min(1).max(5),
  presenters: z
    .array(z.string())
    .nonempty("Al menos un presentador es requerido"),
});

interface Props {
  event: Event;
  presenters: User[];
  presentersOptions: User[];
}

export default function EditEventForm({
  event,
  presenters,
  presentersOptions,
}: Props) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event.name,
      date: new Date(event.date),
      duration: event.duration,
      presenters: presenters.map((presenter) => presenter.email),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch(`/api/events/${event.id}`, {
      method: "PUT",
      // body in json
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        date: values.date.toISOString(),
        duration: values.duration,
        presenters: values.presenters,
      }),
    });

    if (response.ok) {
      toast({
        title: "Evento modificado",
        description: "El evento se ha modificado correctamente",
      });
    } else {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al modificar el evento",
        variant: "destructive",
      });
    }
  };

  const onDelete = async () => {
    const response = await fetch(`/api/events/${event.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      toast({
        title: "Evento eliminado",
        description: "El evento se ha eliminado correctamente",
      });

      const anchor = document.createElement("a");
      anchor.href = "/dashboard";
      anchor.click();
    } else {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar el evento",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
        autoComplete="off"
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Detalles del evento</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDelete}>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex w-full flex-wrap @container">
          <div className="relative aspect-square w-full border-4 @4xl:w-1/2">
            <img
              src={event.image}
              alt={event.name}
              className="absolute h-full w-full object-cover"
            />
          </div>

          <div className="mt-8 flex w-full flex-col space-y-8 @4xl:mt-0 @4xl:w-1/2 @4xl:px-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha</FormLabel>
                  <DatetimePicker
                    value={field.value}
                    onChange={field.onChange}
                    dtOptions={{
                      date: field.value,
                      hour12: true,
                    }}
                    format={[
                      ["days", "months", "years"],
                      ["hours", "minutes", "am/pm"],
                    ]}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Duración - {value}h</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={0.5}
                      defaultValue={[value]}
                      onValueChange={(vals) => {
                        onChange(vals[0]);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="presenters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presentadores</FormLabel>
                  <FormControl>
                    <MultiSelector
                      values={field.value}
                      onValuesChange={field.onChange}
                      loop
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder="Selecciona a los presentadores" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {presentersOptions.map((presenter) => (
                            <MultiSelectorItem
                              key={presenter.id}
                              value={presenter.email}
                            >
                              {presenter.email}
                            </MultiSelectorItem>
                          ))}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isDirty}
            >
              Editar
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
