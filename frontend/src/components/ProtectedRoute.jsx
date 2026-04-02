import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Spin } from 'antd';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (requireAdmin && !isAdmin()) return <Navigate to="/" replace />;

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool,
};

export default ProtectedRoute;
