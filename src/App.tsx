import { QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./routes/app-router";
import { queryClient } from "./api/queryClient";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import { PageTitleProvider } from "./contexts/page-title-context";
import { SidebarProvider } from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./contexts/theme-provider";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <SidebarProvider>
              <ThemeProvider>
                <PageTitleProvider>
                  <AppRouter />
                  <Toaster richColors closeButton />
                </PageTitleProvider>
              </ThemeProvider>
            </SidebarProvider>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
