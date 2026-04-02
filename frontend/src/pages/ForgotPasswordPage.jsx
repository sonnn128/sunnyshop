import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, KeyOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service.js';

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Username, 2: OTP, 3: New Password
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (values) => {
    setLoading(true);
    try {
      await authService.forgotPassword(values.username);
      setUsername(values.username);
      setStep(2);
      message.success('Mã xác nhận đã được gửi đến email của bạn');
    } catch (error) {
      console.error('Error:', error);
      message.error(error.response?.data?.message || 'Không tìm thấy tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (values) => {
    setLoading(true);
    try {
      await authService.verifyOtp(values.otp, username);
      setOtp(values.otp);
      setStep(3);
      message.success('Mã xác nhận hợp lệ');
    } catch (error) {
      console.error('Error:', error);
      message.error(error.response?.data?.message || 'Mã xác nhận không đúng hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(otp, values.newPassword); // Using OTP as token
      message.success('Đổi mật khẩu thành công');
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      message.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, borderRadius: 8 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Quên Mật Khẩu</Title>
        </div>

        {step === 1 && (
          <Form onFinish={handleSearch} layout="vertical">
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập hoặc email" size="large" />
            </Form.Item>
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Link to="/login">
                  <Button icon={<ArrowLeftOutlined />}>Hủy</Button>
                </Link>
                <Button type="primary" htmlType="submit" loading={loading} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                  Tìm kiếm
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}

        {step === 2 && (
          <Form onFinish={handleVerifyOtp} layout="vertical">
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Mã xác nhận đã được gửi đến email đăng ký của tài khoản <strong>{username}</strong>.</Text>
            </div>
            <Form.Item
              label="Nhập Mã Xác Nhận"
              name="otp"
              rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận!' }]}
            >
              <Input prefix={<KeyOutlined />} placeholder="Nhập mã 6 chữ số" size="large" maxLength={6} />
            </Form.Item>
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button onClick={() => setStep(1)}>Quay lại</Button>
                <Button type="primary" htmlType="submit" loading={loading} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                  Xác Nhận Mã
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}

        {step === 3 && (
          <Form onFinish={handleResetPassword} layout="vertical">
            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" size="large" />
            </Form.Item>
            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }} size="large" loading={loading}>
                Đổi Mật Khẩu
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
