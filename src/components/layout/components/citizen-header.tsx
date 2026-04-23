import { Button } from "@/components/ui/button"
import { NotificationPopover } from "@/components/layout/components/notification-popover"
import { UserDropdown } from "@/components/user-dropdown"
import { useAuth } from "@/hooks/use-auth"
import { Building2, LogIn, MapPin } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import GIcon from '@/assets/icon.svg'
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { to: "/gabinetes", label: "Gabinetes", icon: Building2 },
  { to: "/mapa", label: "Mapa", icon: MapPin },
]

export function CitizenHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="fixed bg-white top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-2 border-b border-muted shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/">
          <img src={GIcon} alt="Ícone do Gabinete" className="size-12" />
        </Link>

        <nav className="hidden sm:flex items-center gap-0.5">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}>
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1.5 rounded-full text-xs font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary hover:bg-primary/15"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                  {label}
                </Button>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-1">
        {isAuthenticated && <NotificationPopover />}
        {isAuthenticated ?
          <UserDropdown /> :
          <Link to="/login">
            <Button variant="default">
              Entrar
              <LogIn className="size-4" />
            </Button>
          </Link>
        }
      </div>
    </header>
  )
}
