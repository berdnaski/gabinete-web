import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/api/users/types";
import { Navigate } from "react-router-dom";
import { Loading } from "@/components/loading";

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
  const { user, isInitializing, isLoading } = useAuth();

  if (isInitializing || isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <Loading className="text-primary size-6" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
