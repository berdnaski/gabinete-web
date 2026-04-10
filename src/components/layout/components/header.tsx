import {
  ChevronDown,
  LogOut,
  Settings,
  User
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
    : "U";

  return (
    <header className="flex p-1 border-b border-muted items-center justify-between">
      <div className="flex items-center gap-1 min-w-0 shrink-0">
        <SidebarTrigger className="hover:text-primary transition-all duraion-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-full" />
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Menu do perfil"
              className="flex items-center gap-1 p-1.5 rounded-full hover:bg-muted transition-colors focus:outline-none"
            >
              <Avatar size="default">
                <AvatarFallback className="bg-primary text-white font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 px-3 py-3">
              <Avatar size="lg">
                <AvatarFallback className="bg-primary text-white font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate">{user?.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg">
              <User className="size-4" />
              Ver perfil
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg">
              <Settings className="size-4" />
              Configurações
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer gap-2 rounded-lg text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
            >
              <LogOut className="size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
