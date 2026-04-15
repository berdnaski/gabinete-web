import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { UserRole, UserRoleLabel } from "@/api/users/types";
import { Link } from "react-router-dom";

export function UserDropdown() {
  const { user, logout } = useAuth()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label="Menu do perfil"
          className="flex items-center gap-1 p-1.5 rounded-full hover:bg-muted transition-colors focus:outline-none shrink-0"
        >
          <Avatar size="default">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-primary text-white font-semibold text-xs">
              {getFirstLettersFromNames(user?.name as string)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="flex p-1 gap-2 items-center">
          <Avatar size="lg">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-primary text-white font-semibold">
              {getFirstLettersFromNames(user?.name as string)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold truncate">
                {user?.name}
              </span>
              ·
              <small className="text-xs font-normal text-muted-foreground">{UserRoleLabel[user?.role as UserRole]}</small>
            </div>
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <Link to="/settings">
          <DropdownMenuItem
            variant="default"
            className="cursor-pointer"
          >
            <Settings className="size-4" />
            Configurações
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem
          onClick={logout}
          variant="destructive"
          className="cursor-pointer"
        >
          <LogOut className="size-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}