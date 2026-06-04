import { Button } from "@/components/ui/button"
import { NotificationPopover } from "@/components/layout/components/notification-popover"
import { UserDropdown } from "@/components/user-dropdown"
import { useAuth } from "@/hooks/use-auth"
import { Building2, ChevronDown, LayoutDashboard, LogIn, MapPin, MapPinHouse, X } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import GIcon from '@/assets/icon.svg'
import { cn } from "@/lib/utils"
import { useNavigationCity, type NavigationCity } from "@/contexts/navigation-city-context"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CitySearchInput } from "@/components/city-picker/city-search-input"
import { useState } from "react"

const PUBLIC_NAV_LINKS = [
  { to: "/gabinetes", label: "Gabinetes", icon: Building2 },
  { to: "/mapa", label: "Mapa", icon: MapPin },
]

const CITIZEN_NAV_LINKS = [
  { to: "/my-neighborhood", label: "Meu Bairro", icon: MapPinHouse },
  { to: "/my-demands", label: "Minhas Demandas", icon: LayoutDashboard },
]

function CityIndicator() {
  const { navigationCity, setNavigationCity, clearNavigationCity } = useNavigationCity()
  const [open, setOpen] = useState(false)

  function handleSelect(city: NavigationCity) {
    setNavigationCity(city)
    setOpen(false)
  }

  function handleClear() {
    clearNavigationCity()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-border bg-muted/40",
            "text-xs font-medium transition-colors",
            "hover:bg-muted hover:border-border/80",
            open && "bg-muted border-border/80",
            navigationCity ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <MapPin className={cn("size-3 shrink-0", navigationCity ? "text-primary" : "text-muted-foreground")} />
          <span className="hidden sm:inline max-w-32 truncate">
            {navigationCity?.label ?? "Todas as cidades"}
          </span>
          <ChevronDown className={cn("size-3 text-muted-foreground shrink-0 transition-transform duration-150", open && "rotate-180")} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-0 gap-0 rounded-xl"
        align="start"
        sideOffset={6}
      >
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs font-semibold text-foreground">Filtrar por cidade</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {navigationCity ? (
              <>Vendo demandas de <span className="font-medium text-foreground">{navigationCity.label}</span></>
            ) : (
              "Selecione uma cidade para filtrar o feed e o mapa"
            )}
          </p>
        </div>
        <div className="px-3 py-3 flex flex-col gap-2">
          <CitySearchInput
            onSelect={handleSelect}
            autoFocus={open}
            placeholder="Buscar cidade..."
          />
          {navigationCity && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="justify-start gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
              Ver todas as cidades
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function CitizenHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="fixed bg-background top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-2 border-b border-border">
      <div className="flex items-center gap-3">
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

        <CityIndicator />
      </div>

      <div className="flex items-center gap-1">
        {isAuthenticated && <NotificationPopover />}
        {isAuthenticated ? (
          <UserDropdown />
        ) : (
          <Link to="/login">
            <Button variant="default">
              Entrar
              <LogIn className="size-4" />
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}
