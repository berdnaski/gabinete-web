import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "./api/queryClient";
import { SplashScreen } from "./components/ui/splash-screen";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./contexts/auth-context";
import { PageTitleProvider } from "./contexts/page-title-context";
import { ThemeProvider } from "./contexts/theme-provider";
import { AppRouter } from "./routes/app-router";

export function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <ThemeProvider defaultTheme="light">
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </ThemeProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <ThemeProvider defaultTheme="light">
              <PageTitleProvider>
                <AppRouter />
                <Toaster closeButton position="top-right" />
              </PageTitleProvider>
            </ThemeProvider>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
