/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/authHooks';

const AuthenticatedRoute = ({ children, showNotFound = false }) => {
  const { user, isLoading } = useAuth();
  const path = showNotFound ? '/404-not-found' : '/login';
  const returnComponent = children ? children : <Outlet />;

  if (isLoading) return null;

  return user ? returnComponent : <Navigate to={path} />;
};

export default AuthenticatedRoute;
