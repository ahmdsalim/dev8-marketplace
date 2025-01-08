/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/authHooks';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { role, isLoading } = useAuth();
  const returnComponent = children ? children : <Outlet />;

  if (isLoading) return null;

  return allowedRoles.includes(role) ? returnComponent : <Navigate to="/not-found" />;
};

export default RoleBasedRoute;
