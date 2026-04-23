import { ClipboardListIcon, Home, Newspaper, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import { cn } from "@/lib/utils";

const routes = {
  socialRoutes: [
    {
      to: "/",
      label: "Feed",
      tooltip: "Feed",
      icon: Newspaper,
    }
  ],
  mainRoutes: [
    {
      to: "/home",
      label: "Início",
      tooltip: "Home",
      icon: Home,
    },
    {
      to: "/demands",
      label: "Demandas",
      tooltip: "Demandas",
      icon: ClipboardListIcon,
    },
    {
      to: "/equipe",
      label: "Equipe",
      tooltip: "Equipe",
      icon: Users,
    },
  ],
};

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <img src={Logo} alt="Logo" className="w-36" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Social</SidebarGroupLabel>
          <SidebarMenu>
            {routes.socialRoutes.map(({ to, label, tooltip, icon: Icon }) => (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton
                  asChild
                  tooltip={tooltip}
                  isActive={pathname === to}
                >
                  <Link to={to}>
                    <Icon className={cn({ "text-primary": pathname === to })} />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Gabinete</SidebarGroupLabel>
          <SidebarMenu className="space-y-0.5">
            {routes.mainRoutes.map(({ to, label, tooltip, icon: Icon }) => (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton
                  asChild
                  tooltip={tooltip}
                  isActive={pathname === to}
                >
                  <Link to={to}>
                    <Icon className={cn({ "text-primary": pathname === to })} />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
