import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { DemandsForm } from "@/pages/private/demands/components/demands-form";
import { ChevronDown, ClipboardListIcon, Home, LogOut, Settings, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo.png";

const navItems = [
  { to: "/home", label: "Início", icon: Home },
  { to: "/demands", label: "Demandas", icon: ClipboardListIcon },
];

export function MemberHeader() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();



  return (
    <header className="flex fixed top-0 inset-x-0 z-50 shadow items-center justify-between px-6 py-2 border-b border-muted bg-background">
      <img src={Logo} alt="Logo" className="w-32 shrink-0" />

      <nav className="flex items-center gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === to
                ? "bg-[#1877F2]/10 text-[#1877F2]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <DemandsForm sizeTrigger="icon" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Menu do perfil"
              className="flex items-center gap-1 p-1.5 rounded-full hover:bg-muted transition-colors focus:outline-none shrink-0"
            >
              <Avatar size="default">
                <AvatarImage src={user?.avatarUrl} className="object-cover" />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>



          <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 px-3 py-3">
              <Avatar size="lg">
                <AvatarImage src={user?.avatarUrl} className="object-cover" />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <User className="size-6" />
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

            <DropdownMenuItem
              className="cursor-pointer gap-2 rounded-lg"
              onClick={() => navigate("/settings")}
            >
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
