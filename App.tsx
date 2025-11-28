import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ClientDashboard from './pages/ClientDashboard';
import HotelDashboard from './pages/HotelDashboard';
import { StorageService } from './services/storage';
import { UserRole } from './types';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }: React.PropsWithChildren<{ allowedRole?: UserRole }>) => {
  const user = StorageService.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to correct dashboard if role doesn't match
    return <Navigate to={user.role === UserRole.CLIENT ? '/dashboard-client' : '/dashboard-hotel'} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/dashboard-client" element={
            <ProtectedRoute allowedRole={UserRole.CLIENT}>
              <ClientDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard-hotel" element={
            <ProtectedRoute allowedRole={UserRole.HOTEL}>
              <HotelDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;