import React from 'react';
import { Button, Result } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleGoBack = () => {
    if (isAdminRoute) {
      navigate('/admin/dashboard');
      return;
    }
    navigate('/');
  };

  return (
    <div style={{ padding: '48px 16px' }}>
      <Result
        status="404"
        title="404"
        subTitle="Trang ban tim khong ton tai."
        extra={
          <Button type="primary" onClick={handleGoBack}>
            {isAdminRoute ? 'Ve trang quan tri' : 'Ve trang chu'}
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;
