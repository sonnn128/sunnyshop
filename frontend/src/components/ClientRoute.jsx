import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Spin } from 'antd';

/**
 * A wrapper for routes that should NOT be accessible by Admins.
 * Admins are redirected to their dashboard.
 * Guests and regular Users are allowed.
 */
function ClientRoute({ children }) {
    const { loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    // If user is Admin, redirect to Admin Dashboard
    if (isAdmin()) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Otherwise (Guest or User), allow access
    return children;
}

ClientRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ClientRoute;
