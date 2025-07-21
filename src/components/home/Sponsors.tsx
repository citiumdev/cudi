import Image from "next/image";
import Citium from "@/assets/sponsors/citium.svg";
import TeslaStore from "@/assets/sponsors/tesla-store.png";
import Nebula from "@/assets/sponsors/nebula.png";
import { cn } from "@/lib/utils";

const sponsors = [
  {
    url: "https://www.citium.dev",
    name: "Citium",
    image: Citium,
    className: "invert"
  },
  {
    url: "https://www.instagram.com/teslastoreve/",
    name: "Tesla Store",
    image: TeslaStore,
    className: ""
  },
  {
    url: "https://nebulapymes.com",
    name: "Nebula",
    image: Nebula,
    className: "grayscale invert"
  },
]

export default function Sponsors() {
  return (
    <section
      id="about"
      className="container mx-auto mb-40 flex min-h-screen max-w-6xl items-center px-4 py-32"
    >
      <div className="flex w-full flex-wrap">
        <div className="flex w-full flex-col p-4 mb-8 text-center">
          <h1 className="text-6xl font-bold mb-4">Patrocinadores</h1>
          <p className="text-neutral-400">
            ¡Muchas gracias a nuestros patrocinadores!
          </p>
        </div>
        <div className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-900 rounded-xl">
          {sponsors.map((s, i) =>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              key={i}
              className="hover:bg-neutral-800 w-full h-full rounded-xl flex items-center justify-center transition-all py-6 px-2"
            >
              <Image
                src={s.image}
                alt={s.name}
                className={cn("max-h-40 max-w-40 w-auto", s.className)}
              />
            </a>

          )}
        </div>
      </div>
    </section>
  );
}
