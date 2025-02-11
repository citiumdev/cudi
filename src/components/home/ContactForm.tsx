"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twJoin } from "tailwind-merge";
import { toast } from "sonner";
import { Button } from "../ui/button";

const formSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  email: z.string().email("Ingrese un correo válido"),
  message: z.string().min(1, "El mensaje es obligatorio"),
});

export default function ContactForm() {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("message", data.message);

    const result = await fetch("https://formspree.io/f/meojwdkl", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    reset();

    if (!result.ok) {
      toast("¡Ups! Algo salió mal.", {
        description: "Por favor, inténtalo de nuevo.",
      });
      return;
    }

    toast("¡Gracias por tu mensaje!", {
      description: "Te responderemos lo antes posible.",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-center space-y-8 rounded-lg border border-neutral-800 bg-gradient-to-b from-transparent to-chetwode-900/0 px-6 py-8"
      autoComplete="off"
    >
      <h2 className="text-xl font-bold md:text-2xl">
        ¿Quieres colaborar con nosotros?
      </h2>
      <div className="flex w-full flex-col">
        <label
          htmlFor="name"
          className={twJoin(
            "mb-2 block text-sm font-medium text-neutral-500",
            formState.errors.name ? "text-red-500" : "",
          )}
        >
          Nombre
        </label>
        <input
          type="text"
          id="name"
          className="block w-full rounded-md border border-neutral-800 bg-transparent p-2 text-neutral-100 transition-all focus:border-chetwode-500 focus:ring-chetwode-500"
          placeholder="Jhon Doe"
          {...register("name")}
        />
        <p className="mt-2 text-sm text-red-500">
          {formState.errors.name?.message}
        </p>
      </div>
      <div className="flex w-full flex-col">
        <label
          htmlFor="email"
          className={twJoin(
            "mb-2 block text-sm font-medium text-neutral-500",
            formState.errors.email ? "text-red-500" : "",
          )}
        >
          Correo
        </label>
        <input
          type="text"
          id="email"
          className="block w-full rounded-md border border-neutral-800 bg-transparent p-2 text-neutral-100 transition-all focus:border-chetwode-500 focus:ring-chetwode-500"
          placeholder="email@example.com"
          {...register("email")}
        />
        <p className="mt-2 text-sm text-red-500">
          {formState.errors.email?.message}
        </p>
      </div>
      <div className="flex w-full flex-col">
        <label
          htmlFor="message"
          className={twJoin(
            "mb-2 block text-sm font-medium text-neutral-500",
            formState.errors.message ? "text-red-500" : "",
          )}
        >
          Mensaje
        </label>
        <textarea
          rows={4}
          id="message"
          className="block w-full resize-none rounded-md border border-neutral-800 bg-transparent p-2 text-neutral-100 transition-all focus:border-chetwode-500 focus:ring-chetwode-500"
          placeholder="Escribe aquí tu mensaje"
          {...register("message")}
        ></textarea>
        <p className="mt-2 text-sm text-red-500">
          {formState.errors.message?.message}
        </p>
      </div>

      <Button className="w-full">Enviar</Button>
    </form>
  );
}
