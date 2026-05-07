import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const StaffProtectedRoute = () => {
  const { token, user, loading } = useAuth();

  if (loading || (token && !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-workie-blue border-t-transparent" />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  if (!user?.is_staff && !user?.is_superuser) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

export default StaffProtectedRoute;
