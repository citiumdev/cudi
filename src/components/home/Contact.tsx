import { Instagram } from "lucide-react";
import Discord from "@/components/svg/Discord";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section
      id="contact"
      className="container mx-auto mb-40 flex min-h-screen max-w-6xl items-center px-2 py-32"
    >
      <div className="flex w-full flex-wrap">
        <div className="flex flex-col p-4 lg:w-1/2">
          <h1 className="mb-4 text-6xl font-bold">Contacto</h1>
          <div className="space-y-6">
            <p className="leading-loose">
              Estamos en constante búsqueda de alianzas estratégicas y
              patrocinadores que compartan nuestra visión de impulsar el talento
              joven y fomentar el desarrollo tecnológico. Si estás interesado en
              colaborar con nosotros o deseas más información sobre nuestras
              actividades, no dudes en completar el formulario a continuación.
              También puedes seguirnos en nuestras redes sociales para estar al
              tanto de nuestras últimas novedades y eventos.
            </p>
            <p className="font-bold leading-loose text-chetwode-500">
              ¡Esperamos con interés tu mensaje!
            </p>
          </div>
          <div className="mt-6 flex items-center space-x-4">
            <a
              className="flex rounded-full border border-neutral-700 bg-neutral-950 p-3 text-neutral-500 transition-all hover:bg-chetwode-950/20 hover:text-chetwode-600"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/cudiuneg_"
              aria-label="Instagram"
            >
              <Instagram className="size-6" />
            </a>
            <a
              className="flex rounded-full border border-neutral-700 bg-neutral-950 fill-neutral-500 p-3 transition-all hover:bg-chetwode-950/20 hover:fill-chetwode-600"
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.gg/7RuXAYkJHK"
              aria-label="Instagram"
            >
              <Discord className="size-6" />
            </a>
          </div>
        </div>
        <div className="flex w-full flex-col p-4 lg:w-1/2">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
