import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space, Row, Col } from 'antd';
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
    <Row style={{ minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Left side: Image/Branding */}
      <Col xs={0} md={12} lg={14} style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url('/auth-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)',
        }} />
        <div style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          color: '#fff'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'auto', alignSelf: 'flex-start', color: '#fff', textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>Sunny Shop</span>
          </Link>
          <div style={{ maxWidth: '480px' }}>
            <Typography.Title level={1} style={{ color: '#fff', fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
              Khôi phục quyền truy cập.
            </Typography.Title>
            <Typography.Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '18px', lineHeight: 1.6 }}>
              Bảo vệ an toàn thông tin tài khoản của bạn với quy trình xác thực OTP trực tiếp qua email.
            </Typography.Paragraph>
          </div>
        </div>
      </Col>

      {/* Right side: Form */}
      <Col xs={24} md={12} lg={10} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '40px',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <Title level={2} style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              Quên mật khẩu
            </Title>
            <Text style={{ color: '#6B7280', fontSize: '16px' }}>
              {step === 1 ? 'Nhập tên đăng nhập hoặc email của bạn để nhận mã xác thực.' : step === 2 ? 'Chúng tôi đã gửi một mã xác thực qua email.' : 'Vui lòng thiết lập mật khẩu mới an toàn.'}
            </Text>
          </div>

          {step === 1 && (
            <Form onFinish={handleSearch} layout="vertical" requiredMark={false}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#374151' }}>Tên đăng nhập hoặc Email</span>}
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                style={{ marginBottom: '24px' }}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />} 
                  placeholder="Nhập tên đăng nhập hoặc email" 
                  size="large" 
                  style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '15px' }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ height: '52px', backgroundColor: '#4F46E5', borderRadius: '12px', fontSize: '16px', fontWeight: '600' }}>
                  Gửi mã xác nhận
                </Button>
              </Form.Item>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link to="/login" style={{ color: '#6B7280', fontWeight: 500 }}><ArrowLeftOutlined style={{ marginRight: 8 }} /> Quay lại trang đăng nhập</Link>
              </div>
            </Form>
          )}

          {step === 2 && (
            <Form onFinish={handleVerifyOtp} layout="vertical" requiredMark={false}>
              <div style={{ marginBottom: 24, padding: '16px', backgroundColor: '#EFF6FF', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                <Text style={{ color: '#1E40AF' }}>Mã xác nhận 6 chữ số đã được gửi đến email tài khoản <strong>{username}</strong>.</Text>
              </div>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#374151' }}>Nhập mã xác nhận (OTP)</span>}
                name="otp"
                rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận!' }]}
                style={{ marginBottom: '24px' }}
              >
                <Input 
                  prefix={<KeyOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />} 
                  placeholder="••••••" 
                  size="large" 
                  maxLength={6} 
                  style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '18px', letterSpacing: '4px', textAlign: 'center' }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ height: '52px', backgroundColor: '#4F46E5', borderRadius: '12px', fontSize: '16px', fontWeight: '600' }}>
                  Xác nhận mã OTP
                </Button>
              </Form.Item>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button type="link" onClick={() => setStep(1)} style={{ color: '#6B7280', fontWeight: 500 }}>Nhập sai tài khoản?</Button>
              </div>
            </Form>
          )}

          {step === 3 && (
            <Form onFinish={handleResetPassword} layout="vertical" requiredMark={false}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#374151' }}>Mật khẩu mới</span>}
                name="newPassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                ]}
                style={{ marginBottom: '20px' }}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />} 
                  placeholder="••••••••" 
                  size="large" 
                  style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}
                />
              </Form.Item>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#374151' }}>Xác nhận mật khẩu</span>}
                name="confirmPassword"
                rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
                style={{ marginBottom: '32px' }}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />} 
                  placeholder="••••••••" 
                  size="large" 
                  style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ height: '52px', backgroundColor: '#10B981', borderRadius: '12px', fontSize: '16px', fontWeight: '600', border: 'none' }}>
                  Lưu Mật Khẩu
                </Button>
              </Form.Item>
            </Form>
          )}

        </div>
      </Col>
    </Row>
  );
};

export default ForgotPasswordPage;
