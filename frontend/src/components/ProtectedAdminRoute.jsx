import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="large" message="Authenticating credentials..." />
      </div>
    );
  }

  // Redirect to login if not authenticated or not an admin
  if (!isAuthenticated || !isAdmin) {
    console.warn('[ROUTING] Access denied: Authenticated Admin role required.');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
