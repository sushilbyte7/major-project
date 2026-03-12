import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();
    if (loading) return <div className="flex justify-center items-center h-64 text-slate-400">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
