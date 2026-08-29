/**
 * @file ProtectedRoute.jsx
 * @description Prevents unauthenticated visitors from rendering institution routes.
 * @layer Client Routing
 * @interacts AuthContext, React Router and LoadingState.
 * @futureWork Add client-side role display rules when admin pages exist.
 * @nonGoal Do not treat client guarding as backend authorization.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import LoadingState from './LoadingState';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <LoadingState message="Checking your session…" className="min-h-[50vh]" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
