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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signIn, signOut } from "auth-astro/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Calendar, Home, Inbox } from "lucide-react";
import type { User } from "@/types/user";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

const items = [
  {
    title: "Inicio",
    url: "#",
    icon: Home,
  },
  {
    title: "Certificados",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Eventos",
    url: "#",
    icon: Calendar,
  },
];

interface Props {
  childre: React.ReactNode;
  user: User;
}

export default function DashboardSidebar({ user, children }: Props) {
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
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
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
