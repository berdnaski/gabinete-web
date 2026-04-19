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
import { Demands } from "@/pages/private/demands";
import { Home } from "@/pages/private/home";
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
      </Route>
    </Routes>
  );
}
