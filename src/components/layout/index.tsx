import { useAuth } from "@/hooks/use-auth";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Header } from "./components/header";
import { MemberHeader } from "./components/member-header";

export function Layout() {
  const { user } = useAuth();

  if (user?.role === "MEMBER") {
    return (
      <div className="min-h-screen flex flex-col">
        <MemberHeader />
        <main className="pt-20 p-6 bg-muted min-h-screen">
          <Outlet />
        </main>
      </div>
    );
  }

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
        <main className="">
          <Header />
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
