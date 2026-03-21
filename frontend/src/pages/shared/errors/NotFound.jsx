import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '16px',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
      }}>
        <Result
          status="404"
          title="Trang Không Tìm Thấy"
          subTitle="Trang bạn đang tìm không tồn tại hoặc đã bị xóa."
          extra={[
            <Button
              key="back"
              type="primary"
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={() => window.history?.back()}
            >
              Quay Lại
            </Button>,
            <Button
              key="home"
              size="large"
              onClick={() => navigate('/')}
              icon={<HomeOutlined />}
            >
              Về Trang Chủ
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};

export default NotFound;
