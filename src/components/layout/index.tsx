import { useAuth } from "@/hooks/use-auth";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Header } from "./components/header";
import { CitizenHeader } from "./components/citizen-header";
import { UserRole } from "@/api/users/types";

const rolesWithSidebar = [UserRole.ADMIN, UserRole.MEMBER]

export function Layout() {
  const { user } = useAuth();

  if (user && rolesWithSidebar.includes(user.role)) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset className="border border-muted shadow-2xl">
          <Header />
          <div className="pt-4 p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CitizenHeader />
      <div className="pt-20 p-6 min-h-screen bg-[#F8F8F8]">
        <Outlet />
      </div>
    </div>
  );
}
