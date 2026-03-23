import { Navigate, Route, Routes } from "react-router-dom";
import { SignIn } from "@/pages/public/auth/signIn";
import { SignUp } from "@/pages/public/auth/signup";
import { PrivateRoute } from "@/components/private-route";
import { Layout } from "@/components/layout";
import { Demands, Home } from "@/pages";
import { DemandsForm } from "@/pages/private/demands/components/demands-form";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signIn" replace />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/signIn" element={<SignIn />} />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/demands" element={<Demands />} />
        <Route path="/demands/new" element={<DemandsForm />} />
      </Route>
    </Routes>
  );
}
