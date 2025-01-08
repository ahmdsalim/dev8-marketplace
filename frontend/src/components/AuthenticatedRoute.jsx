/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/authHooks';
import Preloader from './Preloader';

const AuthenticatedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const returnComponent = children ? children : <Outlet />;

  if (isLoading) return <Preloader />;

  return user ? returnComponent : <Navigate to={'/login'} />;
};

export default AuthenticatedRoute;
