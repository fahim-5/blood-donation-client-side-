import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const VolunteerRoute = ({ children }) => {
  const { user, isVolunteer, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Check if user exists
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin or volunteer
  if (!isAdmin() && !isVolunteer()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user is blocked
  if (user.status === 'blocked') {
    return <Navigate to="/blocked" replace />;
  }

  return children;
};

export default VolunteerRoute;