import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service.js';

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      message.error('Invalid or missing reset token');
      navigate('/login');
    }
  }, [token, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, values.newPassword);
      message.success('Password reset successfully');
      navigate('/login');
    } catch (error) {
      console.error('Reset password error:', error);
      message.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Reset Password</Title>
          <Text type="secondary">Enter your new password</Text>
        </div>

        <Form
          name="reset_password"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} size="large" loading={loading}>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
