import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const StudentRoute = () => {
  const { user, role } = useAuth();
  if (!user || role !== 'student') {
    return <Navigate to="/student/login" replace />;
  }
  return <Outlet />;
};

export const AdminRoute = () => {
  const { user, role } = useAuth();
  if (!user || role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
};
