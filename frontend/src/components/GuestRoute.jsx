import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '@/helpers/AuthHelpers';

export default function GuestRoute() {

  if (isAuthenticated()) {
    return <Navigate to={'/'} replace />;
  }
  
  return <Outlet />;
}
