import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppRecoilProvider from './store/RecoilProvider.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import CheckEmailPage from './pages/CheckEmailPage.jsx';
import ActivateAccountPage from './pages/ActivateAccountPage.jsx';


// Import tailwind css
import './index.css';

function App() {
  return (
    <AppRecoilProvider>
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/activate/:uid/:token" element={<ActivateAccountPage />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more protected routes here */}
        </Route>
        
        {/* Redirect to login if no route matches */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
    </AppRecoilProvider>
  );
}

export default App;