import { useGetDemandsByCabinetSlug } from "@/api/demands/hooks"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentMember } from "@/hooks/use-current-member"
import { cn } from "@/lib/utils"
import { Building2, CheckSquare, ClipboardListIcon, Flag, ExternalLink, Globe, Home, LayoutDashboard, MapPin, Newspaper, Users, BarChart3, Map } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import Logo from "../../../assets/logo.png"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar"

function MyTasksBadge() {
  const { cabinet } = useAuth()
  const { currentMember } = useCurrentMember()

  const { data } = useGetDemandsByCabinetSlug({
    slug: cabinet?.slug as string,
    assigneeMemberId: currentMember?.id,
    limit: 1,
    page: 1,
  })

  const total = data?.meta.total ?? 0
  if (!currentMember || total === 0) return null

  return (
    <span className="ml-auto inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-2xs font-bold leading-none">
      {total > 99 ? "99+" : total}
    </span>
  )
}

export function AppSidebar() {
  const { pathname } = useLocation()
  const { hasRoleAdmin, cabinet, user } = useAuth()
  const isAdmin = hasRoleAdmin()
  const isCitizen = user?.role === "CITIZEN"

  if (isAdmin) {
    return (
      <Sidebar variant="inset">
        <SidebarHeader>
          <img src={Logo} alt="Gabinete Digital" className="w-36" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
              Admin
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Gabinetes" isActive={pathname === "/admin"}>
                  <Link to="/admin">
                    <Building2 className={cn({ "text-primary": pathname === "/admin" })} />
                    <span>Gabinetes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Usuários"
                  isActive={pathname === "/admin/users"}
                >
                  <Link to="/admin/users">
                    <Users className={cn({ "text-primary": pathname === "/admin/users" })} />
                    <span>Usuários</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Denúncias"
                  isActive={pathname === "/admin/denuncias"}
                >
                  <Link to="/admin/denuncias">
                    <Flag className={cn({ "text-primary": pathname === "/admin/denuncias" })} />
                    <span>Denúncias</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Mapa" isActive={pathname === "/mapa"}>
                  <Link to="/mapa">
                    <Map className={cn({ "text-primary": pathname === "/mapa" })} />
                    <span>Mapa</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <img src={Logo} alt="Gabinete Digital" className="w-36" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
            Social
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Feed" isActive={pathname === "/"}>
                <Link to="/">
                  <Newspaper className={cn({ "text-primary": pathname === "/" })} />
                  <span>Feed</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Mapa" isActive={pathname === "/mapa"}>
                <Link to="/mapa">
                  <Map className={cn({ "text-primary": pathname === "/mapa" })} />
                  <span>Mapa</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Meu Bairro" isActive={pathname === "/meu-bairro"}>
                <Link to="/meu-bairro">
                  <MapPin className={cn({ "text-primary": pathname === "/meu-bairro" })} />
                  <span>Meu Bairro</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {isCitizen && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Minhas Demandas" isActive={pathname === "/my-demands"}>
                  <Link to="/my-demands">
                    <LayoutDashboard className={cn({ "text-primary": pathname === "/my-demands" })} />
                    <span>Minhas Demandas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>

          {!isCitizen && (
            <>
              <SidebarGroupLabel className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                Gabinete
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-0.5">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Início" isActive={pathname === "/home"}>
                    <Link to="/home">
                      <Home className={cn({ "text-primary": pathname === "/home" })} />
                      <span>Início</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Demandas" isActive={pathname === "/demands"}>
                    <Link to="/demands">
                      <ClipboardListIcon className={cn({ "text-primary": pathname === "/demands" })} />
                      <span>Demandas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Minhas Tarefas"
                    isActive={pathname === "/minhas-tarefas"}
                  >
                    <Link to="/minhas-tarefas" className="flex items-center gap-2 w-full">
                      <CheckSquare
                        className={cn({ "text-primary": pathname === "/minhas-tarefas" })}
                      />
                      <span>Minhas Tarefas</span>
                      <MyTasksBadge />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Equipe" isActive={pathname === "/equipe"}>
                    <Link to="/equipe">
                      <Users className={cn({ "text-primary": pathname === "/equipe" })} />
                      <span>Equipe</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Relatórios" isActive={pathname === "/relatorios"}>
                    <Link to="/relatorios">
                      <BarChart3 className={cn({ "text-primary": pathname === "/relatorios" })} />
                      <span>Relatórios</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </>
          )}

        </SidebarGroup>
      </SidebarContent>

      {cabinet?.slug && (
        <SidebarFooter className="border-t border-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={cabinet.name ?? "Perfil público"}>
                <Link to={`/${cabinet.slug}`} target="_blank" rel="noopener noreferrer">
                  <Globe className="text-muted-foreground" />
                  <span className="truncate">{cabinet.name ?? "Ver perfil"}</span>
                  <ExternalLink className="ml-auto size-3 shrink-0 text-muted-foreground/50" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
