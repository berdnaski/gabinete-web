"use client"

import * as React from "react"
import { useLocation, Link } from "react-router-dom"
import {
    HomeIcon,
    UserIcon,
    SettingsIcon,
    LinkIcon,
    ClipboardListIcon,
    HeadphonesIcon,
    TrophyIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuth()
    const location = useLocation()

    const data = {
        user: {
            name: user?.name || "Usuário",
            email: user?.email || "",
            avatar: "",
        },
        teams: [
            {
                name: "Gabinete Digital",
                logo: <LinkIcon strokeWidth={2.5} />,
                plan: "Workspace",
            },
        ],
        navMain: [
            {
                title: "Início",
                url: "/home",
                icon: <HomeIcon />,
                isActive: location.pathname === "/home",
            },
            {
                title: "Perfil",
                url: "/profile",
                icon: <UserIcon />,
                isActive: location.pathname === "/profile",
            },
            {
                title: "Demandas",
                url: "/demands",
                icon: <ClipboardListIcon />,
                isActive: location.pathname === "/demands",
            },
            {
                title: "Participar",
                url: "/participate",
                icon: <HeadphonesIcon />,
                isActive: location.pathname === "/participate",
            },
            {
                title: "Resultados",
                url: "/results",
                icon: <TrophyIcon />,
                isActive: location.pathname === "/results",
            },
        ],
        settings: {
            title: "Configurações",
            url: "/settings",
            icon: <SettingsIcon />,
            isActive: location.pathname === "/settings",
        },
    }

    return (
        <Sidebar collapsible="icon" variant="inset" {...props} className="bg-zinc-50 border-r border-zinc-200/50">
            <SidebarHeader className="group-data-[collapsible=icon]:p-0">
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter className="group-data-[collapsible=icon]:p-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={data.settings.isActive}
                            tooltip={data.settings.title}
                            className={`
                                h-12 text-md rounded-md transition-colors duration-150
                                group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center
                                hover:bg-[#008EFF]/10 hover:text-[#008EFF]
                                data-[active=true]:bg-transparent
                                ${data.settings.isActive
                                    ? "bg-[#008EFF]/10 text-[#008EFF] font-bold"
                                    : "text-zinc-500"
                                }
                            `}
                        >
                            <Link to={data.settings.url} className="flex items-center gap-4 w-full group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center">
                                <span className={`shrink-0 [&>svg]:size-6 ${data.settings.isActive ? "text-[#008EFF]" : ""}`}>
                                    {data.settings.icon}
                                </span>
                                <span className={`truncate group-data-[collapsible=icon]:hidden ${data.settings.isActive ? "text-[#008EFF]" : ""}`}>
                                    {data.settings.title}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />

                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
