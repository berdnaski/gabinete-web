import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { ForgotPassword } from "@/pages/public/forgot-password";
import { Login } from "@/pages/public/login";
import { ResetPassword } from "@/pages/public/reset-password";
import { VerifyEmail } from "@/pages/public/verify-email";
import { Sandbox } from "@/pages/public/sandbox";
import { SignUp } from "@/pages/public/sign-up";
import { GoogleCallback } from "@/pages/public/google-callback";
import { ConfirmPasswordPage } from "@/pages/public/confirm-password";
import { Route, Routes } from "react-router-dom";
import { Feed } from "@/pages/feed";
import { Settings } from "@/pages/settings";
import { DemandComments } from "@/pages/demand-comments";
import { Profile } from "@/pages/profile";
import { Cabinets } from "@/pages/cabinets";
import { CabinetDetail } from "@/pages/cabinet-detail";
import { Map } from "@/pages/map";
import { Demands } from "@/pages/private/demands";
import { Home } from "@/pages/private/home";
import { Team } from "@/pages/private/team";
import { MyTasks } from "@/pages/private/my-tasks";
import { UserRole } from "@/api/users/types";

const adminAndMember = [UserRole.ADMIN, UserRole.MEMBER];

export function AppRouter() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/sandbox" element={<Sandbox />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />
      <Route path="/confirm-password" element={<ConfirmPasswordPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Feed />} />
        <Route path="settings" element={<Settings />} />
        <Route path="comments/:demandId" element={<DemandComments />} />
        <Route path="demands/:demandId" element={<DemandComments />} />
        <Route path="profile/:userId" element={<Profile />} />
        <Route path="gabinetes" element={<Cabinets />} />
        <Route path="gabinetes/:slug" element={<CabinetDetail />} />
        <Route path="mapa" element={<Map />} />

        <Route
          path="home"
          element={
            <ProtectedRoute allowedRoles={adminAndMember}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="demands"
          element={
            <ProtectedRoute allowedRoles={adminAndMember}>
              <Demands />
            </ProtectedRoute>
          }
        />
        <Route
          path="minhas-tarefas"
          element={
            <ProtectedRoute allowedRoles={adminAndMember}>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="equipe"
          element={
            <ProtectedRoute allowedRoles={adminAndMember}>
              <Team />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
