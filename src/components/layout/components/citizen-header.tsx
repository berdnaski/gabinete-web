import { Button } from "@/components/ui/button"
import { NotificationPopover } from "@/components/layout/components/notification-popover"
import { UserDropdown } from "@/components/user-dropdown"
import { useAuth } from "@/hooks/use-auth"
import { Building2, LayoutDashboard, LogIn, MapPin } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import GIcon from '@/assets/icon.svg'
import { cn } from "@/lib/utils"

const PUBLIC_NAV_LINKS = [
  { to: "/gabinetes", label: "Gabinetes", icon: Building2 },
  { to: "/mapa", label: "Mapa", icon: MapPin },
]

const CITIZEN_NAV_LINKS = [
  { to: "/my-demands", label: "Minhas Demandas", icon: LayoutDashboard },
]

export function CitizenHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="fixed bg-background top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-2 border-b border-border">
      <div className="flex items-center gap-4">
        <Link to="/">
          <img src={GIcon} alt="Ícone do Gabinete" className="size-12" />
        </Link>

        <nav className="flex items-center gap-0.5">
          {[...PUBLIC_NAV_LINKS, ...(isAuthenticated ? CITIZEN_NAV_LINKS : [])].map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}>
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1.5 rounded-md text-xs font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <Icon className="size-3.5" />
                  <span className="hidden sm:inline">{label}</span>
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
