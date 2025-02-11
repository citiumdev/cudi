"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signIn, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { User } from "@/types/User";

interface Props {
  user: User | null;
}

export default function UserDropdown({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-11">
          <AvatarImage src={user?.image} />
          <AvatarFallback className="bg-primary font-bold">
            {user?.name?.[0] || <UserIcon className="size-5" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-40">
        <DropdownMenuLabel>{user?.name || "Acceder"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!user ? (
          <DropdownMenuItem onClick={() => signIn()}>
            Iniciar Sesión
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <a href="/dashboard">Panel</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Cerrar Sesión
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
