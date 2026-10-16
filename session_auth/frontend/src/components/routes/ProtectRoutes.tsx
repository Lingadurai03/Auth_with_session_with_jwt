import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  if (isAuthenticated) {
    // Redirect them to dashboard if already logged in
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
