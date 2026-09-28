import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { normalizeRole } from '../utils/roleUtils.js';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAF6] flex flex-col items-center justify-center gap-3">
        <img src="/logo.png" alt="MarketLink" className="w-12 h-12 object-contain animate-pulse mb-1" />
        <Loader2 className="w-6 h-6 text-[#16A34A] animate-spin" />
        <p className="text-sm font-medium text-[#475569]">Verifying MarketLink security session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = normalizeRole ? normalizeRole(role) : role;
  const normalizedAllowed = allowedRoles.map((r) => (normalizeRole ? normalizeRole(r) : r));

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role) &&
    !normalizedAllowed.includes(userRole)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
