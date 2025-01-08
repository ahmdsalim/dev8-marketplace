/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/authHooks';

const RoleBasedRoute = ({ children, allowedRoles, showForbidden = false }) => {
  const { role, isLoading } = useAuth();
  const path = showForbidden ? '/forbidden' : '/not-found';
  const returnComponent = children ? children : <Outlet />;

  if (isLoading) return null;

  return allowedRoles.includes(role) ? returnComponent : <Navigate to={path} />;
};

export default RoleBasedRoute;
