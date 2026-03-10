import { Home, Settings, User, LogOut, ChevronDown, Link as LinkIcon } from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

const items = [
    {
        title: "Início",
        url: "/home",
        icon: Home,
    },
    {
        title: "Perfil",
        url: "/profile",
        icon: User,
    },
    {
        title: "Configurações",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const { logout, user } = useAuth()
    const location = useLocation()
    const { state } = useSidebar()
    const isExpanded = state === "expanded"

    return (
        <Sidebar variant="inset" collapsible="icon" className="bg-zinc-50 border-r border-zinc-200/50">
            <SidebarHeader className="">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="h-16 data-[state=open]:bg-zinc-100 rounded-2xl group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                                    <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-[#008EFF] text-white shrink-0">
                                        <LinkIcon className="size-6" />
                                    </div>
                                    {isExpanded && (
                                        <>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold text-zinc-900 line-clamp-1">Gabinete Digital</span>
                                                <span className="truncate text-xs text-zinc-500">Workspace</span>
                                            </div>
                                            <ChevronDown className="ml-auto size-4 text-zinc-400" />
                                        </>
                                    )}
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[160px]" align="start">
                                <DropdownMenuItem>
                                    <span>Acme Inc</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-4">
                        Navegação
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {items.map((item) => {
                                const isActive = location.pathname === item.url
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className={`
                                                h-16 text-xl rounded-2xl transition-all duration-200
                                                group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center
                                                ${isActive
                                                    ? "bg-[#008EFF]/10 text-[#008EFF] font-bold"
                                                    : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900"
                                                }
                                            `}
                                        >
                                            <Link to={item.url} className="flex items-center gap-5 w-full group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center">
                                                <item.icon className={`size-6 shrink-0 ${isActive ? "text-[#008EFF]" : "text-zinc-400 group-hover/menu-button:text-zinc-600"}`} />
                                                {isExpanded && <span className="truncate">{item.title}</span>}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 py-4">
                <div className="mb-4 py-3 rounded-2xl bg-white/50 border border-zinc-100/50 group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-[#008EFF]/10 flex items-center justify-center text-[#008EFF] font-bold text-xs shrink-0">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-zinc-900 truncate">{user?.name}</span>
                            <span className="text-[10px] text-zinc-500 font-medium truncate">{user?.email}</span>
                        </div>
                    </div>
                </div>

                <SidebarSeparator className="mb-4 bg-zinc-200" />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={logout}
                            size="lg"
                            className="h-16 cursor-pointer rounded-2xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
                            tooltip="Sair"
                        >
                            <LogOut className="size-6 rotate-180" />
                            {isExpanded && <span className="font-bold text-xl">Sair da conta</span>}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar >
    )
}
