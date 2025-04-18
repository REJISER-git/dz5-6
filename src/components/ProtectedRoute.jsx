import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../features/store';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;