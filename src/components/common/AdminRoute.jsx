import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Check if user exists and is admin
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin()) {
    // Redirect to unauthorized page if not admin
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user is blocked
  if (user.status === 'blocked') {
    return <Navigate to="/blocked" replace />;
  }

  return children;
};

export default AdminRoute;