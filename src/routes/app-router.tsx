import { Navigate, Route, Routes } from "react-router-dom";
import { SignUp } from "../pages/public/auth/signup";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
    </Routes>
  )
}