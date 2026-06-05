import { Navigate, Outlet } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

const ProtectedRoute = () => {
  const { token, user, loading } = useAuth();
  
  if (loading || (token && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.is_staff || user?.is_superuser) {
    return <Navigate to="/staff" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
