import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireCouple = false,
  loginComponent = null
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not logged in, show custom login component or redirect
  if (!user) {
    if (loginComponent) {
      return loginComponent;
    }
    return <Navigate to="/" replace />;
  }

  // If logged in but wrong role
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/voting" replace />;
  }

  if (requireCouple && user.role !== 'couple') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
