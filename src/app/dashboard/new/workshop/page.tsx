"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CloudUpload } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
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
import type { DropzoneOptions } from "react-dropzone";
import type { User } from "@/types/User";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getPresenters } from "@/actions/presenters";
import { createWorkshop } from "@/actions/events";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  image: z.array(z.instanceof(File)).length(1, "La imagen es requerida"),
  date: z.coerce.date(),
  duration: z.number().min(1).max(5),
  limit: z.coerce.number().min(0),
  presenters: z
    .array(z.string())
    .nonempty("Al menos un presentador es requerido"),
});

export default function CreateWorkshopPage() {
  const [presentersOptions, setPresentersOptions] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      setPresentersOptions(await getPresenters());
    })();
  }, []);

  const dropZoneConfig: DropzoneOptions = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 2,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: [],
      date: new Date(),
      duration: 4,
      limit: 0,
      presenters: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("image", values.image[0]);
    formData.append("date", values.date.toISOString());
    formData.append("duration", values.duration.toString());
    formData.append("presenters", JSON.stringify(values.presenters));
    formData.append("limit", values.limit.toString());

    const { success } = await createWorkshop(formData);

    if (success) {
      toast("Evento creado", {
        description: "El evento se ha creado correctamente",
      });

      form.reset();
    } else {
      toast("Error", {
        description: "Ha ocurrido un error al crear el evento",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container mx-auto max-w-xl space-y-8"
        autoComplete="off"
      >
        <h1 className="text-3xl font-bold">Crear Taller</h1>
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
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen</FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  dropzoneOptions={dropZoneConfig}
                  className="relative rounded-lg bg-background p-2"
                >
                  {field.value && field.value.length > 0 ? (
                    <div className="rounded-md bg-neutral-800 p-2">
                      <FileUploaderItem index={0} className="h-full p-0">
                        <img
                          src={URL.createObjectURL(field.value[0])}
                          alt={field.value[0].name}
                          className="h-full"
                        />
                      </FileUploaderItem>
                    </div>
                  ) : (
                    <FileInput
                      id="fileInput"
                      className="outline-dashed outline-1 outline-neutral-600"
                    >
                      <div className="flex h-40 w-full flex-col items-center justify-center">
                        <CloudUpload className="h-10 w-10 text-neutral-500" />
                        <p className="mb-1 text-sm text-neutral-500 dark:text-neutral-400">
                          <span className="font-semibold">
                            Haz click o suelta un archivo
                          </span>
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          PNG, JPG o JPEG
                        </p>
                      </div>
                    </FileInput>
                  )}
                  <FileUploaderContent></FileUploaderContent>
                </FileUploader>
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
                {...field}
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
                  defaultValue={[5]}
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
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participantes</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormDescription>
                Dejar en 0 para no limitar participantes
              </FormDescription>
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
        <Button type="submit" className="w-full">
          Crear
        </Button>
      </form>
    </Form>
  );
}
