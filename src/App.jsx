import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPasswordConfirm from "./components/auth/ResetPasswordConfirm";
import ActivateAccountPage from "./pages/ActivateAccountPage";
import CheckEmailPage from "./pages/CheckEmailPage";
import ClientRequestDetailPage from "./pages/ClientRequestDetailPage";
import EditProfile from "./pages/EditProfile";
import HomePage from "./pages/HomePage";
import PublicLayout from "./layouts/PublicLayout";
import useAuth from "./hooks/useAuth";
import ClientRequestPage from "./pages/ClientRequestPage";
import SharedPortfolioPage from "./pages/SharedPortfolioPage";

function App() {
  const { token, user, bootstrapAuth } = useAuth();

  useEffect(() => {
    if (token && !user) {
      bootstrapAuth();
    }
  }, [token, user, bootstrapAuth]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route element={<PublicLayout tone="solid" />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/activate/:uid/:token" element={<ActivateAccountPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
      </Route>
      <Route path="/portfolio/:token" element={<SharedPortfolioPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/client-request" element={<ClientRequestPage />} />
        <Route path="/client-request/:requestId" element={<ClientRequestDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
