import { Layout } from "@/components/layout";
import { PrivateRoute } from "@/components/private-route";
import { ForgotPassword } from "@/pages/public/forgot-password";
import { Login } from "@/pages/public/login";
import { PublicDemands } from "@/pages/public/demands";
import { ResetPassword } from "@/pages/public/reset-password";
import { VerifyEmail } from "@/pages/public/verify-email";
import { Sandbox } from "@/pages/public/sandbox";
import { SignUp } from "@/pages/public/sign-up";
import { GoogleCallback } from "@/pages/public/google-callback";
import { ConfirmPasswordPage } from "@/pages/public/confirm-password";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "@/pages";
import { Demands } from "@/pages/private/demands";
import { Settings } from "@/pages/private/settings";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/demands" replace />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/sandbox" element={<Sandbox />} />
      <Route path="/demands" element={<PublicDemands />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />
      <Route path="/confirm-password" element={<ConfirmPasswordPage />} />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/demands" element={<Demands />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
