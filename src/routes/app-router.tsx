import { Layout } from "@/components/layout";
import { PrivateRoute } from "@/components/private-route";
import { Demands, Home } from "@/pages";
import { ForgotPassword } from "@/pages/public/forgot-password";
import { Login } from "@/pages/public/login";
import { ResetPassword } from "@/pages/public/reset-password";
import { VerifyEmail } from "@/pages/public/verify-email";
import { Sandbox } from "@/pages/public/sandbox";
import { SignUp } from "@/pages/public/sign-up";
import { GoogleCallback } from "@/pages/public/google-callback";
import { Navigate, Route, Routes } from "react-router-dom";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/sandbox" element={<Sandbox />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/demands" element={<Demands />} />
      </Route>
    </Routes>
  );
}
