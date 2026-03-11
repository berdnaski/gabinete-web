"use client"

import * as React from "react"
import { useLocation } from "react-router-dom"
import {
    HomeIcon,
    UserIcon,
    SettingsIcon,
    LinkIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
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
                title: "Configurações",
                url: "/settings",
                icon: <SettingsIcon />,
                isActive: location.pathname === "/settings",
            },
        ],
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
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
