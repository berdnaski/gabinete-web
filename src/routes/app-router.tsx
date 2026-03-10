import { Navigate, Route, Routes } from "react-router-dom";
import { SignIn } from "@/pages/public/auth/signIn";
import { SignUp } from "@/pages/public/auth/signup";
import { Home } from "@/pages/private/home";
import { PrivateRoute } from "@/components/private-route";
import { PublicRoute } from "@/components/public-route";

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
          <Home />
        </PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}