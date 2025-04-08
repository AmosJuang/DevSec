import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    
    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/signin" replace />;
    }
    
    return children;
};

export default AdminRoute;