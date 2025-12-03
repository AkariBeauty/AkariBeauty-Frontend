import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

type Props = { children: ReactNode; allowedRoles?: string[] };

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: 16 }}>Carregando…</div>;
  }

  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("akari_token");

  if (!user && !hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    user?.role &&
    !allowedRoles.some((role) => role.toLowerCase() === user.role?.toLowerCase())
  ) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
