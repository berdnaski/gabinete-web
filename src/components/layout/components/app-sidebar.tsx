import { ClipboardListIcon, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../assets/logo.png";
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
} from "../../ui/sidebar";
import { NavUser } from "@/components/layout/components/nav-user";

const routes = {
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
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarMenu className="space-y-2">
            {routes.mainRoutes.map(({ to, label, tooltip, icon: Icon }) => (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton
                  asChild
                  tooltip={tooltip}
                  isActive={pathname === to}
                >
                  <Link to={to}>
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
