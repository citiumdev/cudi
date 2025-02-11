"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef } from "react";
import {
  Calendar,
  ChevronRight,
  Contact,
  House,
  Menu,
  Users,
  KeyRound,
  LayoutDashboard,
} from "lucide-react";

import { signIn, signOut } from "next-auth/react";
import { User } from "@/types/User";

interface Props {
  user: User | null;
}

export default function NavbarMenu({ user }: Props) {
  const pendingScrollRef = useRef<string | null>(null);

  const handleOnLinkClick = (id: string) => {
    pendingScrollRef.current = id;
  };

  const handleOnAnimationEnd = (open: boolean) => {
    if (open) {
      return;
    }

    document.documentElement.classList.add("scroll-smooth");

    if (!pendingScrollRef.current) {
      return;
    }

    const link = document.createElement("a");
    link.href = `#${pendingScrollRef.current}`;
    link.click();

    pendingScrollRef.current = null;
  };

  const handleOnOpenChange = (open: boolean) => {
    if (open) {
      document.documentElement.classList.remove("scroll-smooth");
    }
  };

  return (
    <Drawer
      onOpenChange={handleOnOpenChange}
      onAnimationEnd={handleOnAnimationEnd}
    >
      <DrawerTrigger asChild>
        <Button className="bg-transparent" size="icon" variant="outline">
          <Menu className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="hidden">Menu</DrawerTitle>
          <DrawerDescription className="hidden">
            Secciones del sitio
          </DrawerDescription>
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex px-2 py-2">
                  <Avatar className="mr-4 size-12">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="bg-primary font-bold">
                      CN
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col text-left">
                    <p className="text-lg font-bold">{user?.name}</p>
                    <p className="truncate text-sm text-neutral-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/dashboard">
                    <LayoutDashboard className="mr-4 size-4" />
                    Panel
                    <ChevronRight className="ml-auto size-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <KeyRound className="mr-4 size-4" />
                  Cerrar Sessión
                  <ChevronRight className="ml-auto size-4" />
                </Button>
              </>
            ) : (
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" onClick={() => signIn()}>
                  <KeyRound className="mr-4 size-4" />
                  Iniciar Sesión
                  <ChevronRight className="ml-auto size-4" />
                </Button>
              </DrawerClose>
            )}

            <Separator />

            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOnLinkClick("home")}
              >
                <House className="mr-4 size-4" />
                Inicio
                <ChevronRight className="ml-auto size-4" />
              </Button>
            </DrawerClose>

            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOnLinkClick("about")}
              >
                <Users className="mr-4 size-4" />
                Nosotros
                <ChevronRight className="ml-auto size-4" />
              </Button>
            </DrawerClose>

            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOnLinkClick("events")}
              >
                <Calendar className="mr-4 size-4" />
                Eventos
                <ChevronRight className="ml-auto size-4" />
              </Button>
            </DrawerClose>

            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOnLinkClick("contact")}
              >
                <Contact className="mr-4 size-4" />
                Contacto
                <ChevronRight className="ml-auto size-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Cerrar Menu</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
