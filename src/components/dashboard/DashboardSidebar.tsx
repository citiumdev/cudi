"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Calendar, CalendarPlus, Home, Inbox } from "lucide-react";
import { User } from "@/types/User";

const items = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Certificados",
    url: "/certificates",
    icon: Inbox,
  },
  {
    title: "Eventos Inscritos",
    url: "/registered",
    icon: Calendar,
  },
];

const adminItems = [
  {
    title: "Crear Taller",
    url: "/new/workshop",
    icon: CalendarPlus,
  },
  {
    title: "Crear Charla",
    url: "/new/talk",
    icon: CalendarPlus,
  },
];

interface Props {
  user: User;
  children: React.ReactNode;
}

export default function DashboardSidebar({ children, user }: Props) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="bg-background px-4 pt-4">
          <h1 className="text-4xl font-bold text-chetwode-500">CUDI</h1>
        </SidebarHeader>
        <SidebarContent className="bg-background">
          <SidebarGroup>
            <SidebarGroupLabel>Opciones</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={"/dashboard" + item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {user.role === "admin" ? (
            <SidebarGroup>
              <SidebarGroupLabel>Administrador</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={"/dashboard" + item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null}
        </SidebarContent>
        <SidebarFooter className="bg-background p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-auto p-1">
                <Avatar className="mr-1 size-10">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="bg-primary font-bold">
                    CN
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden text-left">
                  <p className="font-bold">{user.name}</p>
                  <p className="truncate text-neutral-400">{user.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="w-40">
              <DropdownMenuLabel>{user.name || "Acceder"}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <a href="/dashboard">Panel</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-bold">Panel</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
