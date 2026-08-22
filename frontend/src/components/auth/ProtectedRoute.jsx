import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-bold text-2xl shadow-lg animate-pulse">
          H
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant font-medium text-sm">
          <span className="material-symbols-outlined animate-spin text-[18px] text-primary">
            progress_activity
          </span>
          <span>Loading HostelHub...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};
