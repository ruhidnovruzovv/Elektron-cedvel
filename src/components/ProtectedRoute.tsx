import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import usePermissions from '../hooks/usePermissions';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermission }) => {
  const { isAuthenticated } = useAuth();
  const hasPermission = requiredPermission ? usePermissions(requiredPermission) : true;

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!hasPermission) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;