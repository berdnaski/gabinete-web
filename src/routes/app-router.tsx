import { Navigate, Route, Routes } from "react-router-dom";
import { SignIn } from "@/pages/public/auth/signIn";
import { SignUp } from "@/pages/public/auth/signup";
import { Home } from "@/pages/private/home";
import { PrivateRoute } from "@/components/private-route";
import { PublicRoute } from "@/components/public-route";
import { AppLayout } from "@/components/app-layout";
import { Demands } from "@/pages/private/demands";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signIn" replace />} />

      <Route path="/signUp" element={
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      } />

      <Route path="/signIn" element={
        <PublicRoute>
          <SignIn />
        </PublicRoute>
      } />

      <Route path="/home" element={
        <PrivateRoute>
          <AppLayout title="Dashboard" description="Visão geral do gabinete">
            <Home />
          </AppLayout>
        </PrivateRoute>
      } />

      <Route path="/demands" element={
        <PrivateRoute>
          <AppLayout title="Gestão de Demandas" description="Visualize e gerencie todas as solicitações operacionais.">
            <Demands />
          </AppLayout>
        </PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}