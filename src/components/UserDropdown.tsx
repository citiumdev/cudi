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
import type { User } from "@/types/user";

interface Props {
  user: User | null;
}

export default function UserDropdown({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-12">
          <AvatarImage src={user?.image} />
          <AvatarFallback className="bg-primary font-bold">CN</AvatarFallback>
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
