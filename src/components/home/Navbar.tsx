import { getServerSession } from "next-auth";
import Logo from "../svg/Logo";
import UserDropdown from "./UserDropdown";
import NavbarMenu from "./NavBarMenu";

export default async function Navbar() {
  const session = await getServerSession();

  return (
    <nav className="fixed left-0 top-0 z-10 flex w-full">
      <div className="container mx-auto hidden w-full items-center gap-4 px-6 py-4 sm:flex">
        <Logo className="size-12 fill-white" />

        <div className="container mx-auto max-w-2xl">
          <div className="flex h-12 items-center justify-center overflow-hidden rounded-full border border-neutral-700 bg-neutral-950/50 backdrop-blur">
            <a
              href="#home"
              className="flex h-full flex-1 items-center justify-center px-4 text-sm text-white hover:bg-chetwode-800/10 md:text-base"
            >
              Inicio
            </a>
            <a
              href="#about"
              className="flex h-full flex-1 items-center justify-center px-4 text-sm text-white hover:bg-chetwode-800/10 md:text-base"
            >
              Nosotros
            </a>
            <a
              href="#events"
              className="flex h-full flex-1 items-center justify-center px-4 text-sm text-white hover:bg-chetwode-800/10 md:text-base"
            >
              Eventos
            </a>
            <a
              href="#contact"
              className="flex h-full flex-1 items-center justify-center px-4 text-sm text-white hover:bg-chetwode-800/10 md:text-base"
            >
              Contacto
            </a>
          </div>
        </div>
        <UserDropdown user={session?.user || null} />
      </div>

      <div className="flex w-full items-center justify-end gap-4 px-6 py-4 sm:hidden">
        <NavbarMenu user={session?.user || null} />
      </div>
    </nav>
  );
}
