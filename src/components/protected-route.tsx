import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/api/users/types";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: string;
}

export function ProtectedRoute({
  allowedRoles,
  children,
  fallback = "/",
}: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
