import { useGetDemandsByCabinetSlug } from "@/api/demands/hooks"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentMember } from "@/hooks/use-current-member"
import { cn } from "@/lib/utils"
import { CheckSquare, ClipboardListIcon, Home, Newspaper, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import Logo from "../../../assets/logo.png"
import {
  Sidebar,
  SidebarContent,
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

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <img src={Logo} alt="Logo" className="w-36" />
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
          </SidebarMenu>

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
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
