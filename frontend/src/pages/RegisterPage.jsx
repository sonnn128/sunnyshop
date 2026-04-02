import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Divider, Select, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, ShoppingOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const { Title, Paragraph, Text } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await register(values);
      if (result.success) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row style={{ minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', sans-serif", backgroundColor: '#fff' }}>
      {/* Left side: Image/Branding (Sticky to handle long scroll on the right) */}
      <Col xs={0} lg={10} style={{ position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
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
            background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%)',
          }} />
          <div style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', alignSelf: 'flex-start' }}>
               <ShoppingOutlined style={{ fontSize: '32px', color: '#fff' }} />
               <span style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>Sunny Shop</span>
            </div>
            
            <div style={{ marginTop: 'auto', marginBottom: '80px', maxWidth: '400px' }}>
              <Title level={1} style={{ color: '#fff', fontSize: '42px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
                Bắt đầu hành trình cùng chúng tôi.
              </Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '18px', lineHeight: 1.6 }}>
                Đăng ký ngay hôm nay để tận hưởng các đặc quyền dành riêng cho thành viên, các đề xuất cá nhân hóa, và thanh toán cực nhanh.
              </Paragraph>
            </div>
          </div>
        </div>
      </Col>

      {/* Right side: Form (Scrollable) */}
      <Col xs={24} lg={14} style={{ display: 'flex', justifyContent: 'center', padding: '60px 40px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <Title level={2} style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              Tạo tài khoản mới
            </Title>
            <Paragraph style={{ color: '#6B7280', fontSize: '16px' }}>
              Rất vui được chào đón bạn! Hãy bắt đầu thôi.
            </Paragraph>
          </div>

          <Form
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="fullName"
                  label={<span style={{ fontWeight: 600, color: '#374151' }}>Họ và tên</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                  style={{ marginBottom: '20px' }}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />} 
                    placeholder="Nguyễn Văn A" 
                    size="large"
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '15px' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="username"
                  label={<span style={{ fontWeight: 600, color: '#374151' }}>Tên đăng nhập</span>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                    { min: 3, message: 'Tên đăng nhập ít nhất 3 ký tự!' }
                  ]}
                  style={{ marginBottom: '20px' }}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />} 
                    placeholder="nguyenvana123" 
                    size="large"
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '15px' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Địa chỉ Email</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
              style={{ marginBottom: '20px' }}
            >
              <Input 
                prefix={<MailOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />} 
                placeholder="you@example.com" 
                size="large"
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '15px' }}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phone"
                  label={<span style={{ fontWeight: 600, color: '#374151' }}>Số điện thoại</span>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ!' }
                  ]}
                  style={{ marginBottom: '20px' }}
                >
                  <Input 
                    prefix={<PhoneOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />} 
                    placeholder="0912 345 678" 
                    size="large"
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '15px' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="gender"
                  label={<span style={{ fontWeight: 600, color: '#374151' }}>Giới tính</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                  style={{ marginBottom: '20px' }}
                >
                  <Select
                    placeholder="Chọn giới tính"
                    size="large"
                    dropdownStyle={{ borderRadius: '12px' }}
                    style={{ 
                      height: '48px', 
                    }}
                    options={[
                      { value: 'MALE', label: 'Nam' },
                      { value: 'FEMALE', label: 'Nữ' },
                      { value: 'OTHER', label: 'Khác' }
                    ]}
                  />
                </Form.Item>
                {/* Global styles fix for antd select to match inputs */}
                <style>{`
                  .ant-select-single .ant-select-selector {
                    border-radius: 12px !important;
                    background-color: #F9FAFB !important;
                    border: 1px solid #E5E7EB !important;
                    height: 48px !important;
                    align-items: center !important;
                  }
                  .ant-select-single .ant-select-selection-item {
                    line-height: 46px !important;
                    font-size: 15px !important;
                  }
                `}</style>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Địa chỉ</span>}
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              style={{ marginBottom: '20px' }}
            >
              <Input 
                prefix={<HomeOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />} 
                placeholder="123 Đường chính, Quận/Huyện" 
                size="large"
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '15px' }}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="password"
                  label={<span style={{ fontWeight: 600, color: '#374151' }}>Mật khẩu</span>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu ít nhất 6 ký tự!' }
                  ]}
                  style={{ marginBottom: '20px' }}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />}
                    placeholder="••••••••"
                    size="large"
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '15px' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="confirmPassword"
                  label={<span style={{ fontWeight: 600, color: '#374151' }}>Xác nhận mật khẩu</span>}
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                      },
                    }),
                  ]}
                  style={{ marginBottom: '32px' }}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />}
                    placeholder="••••••••"
                    size="large"
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '15px' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                block
                style={{ 
                  height: '52px',
                  backgroundColor: '#4F46E5',
                  boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                <span>Đăng ký tài khoản</span>
                {!loading && <ArrowRightOutlined style={{ marginLeft: '8px', fontSize: '14px' }} />}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ color: '#9CA3AF', fontSize: '14px', margin: '32px 0' }}>đã là thành viên?</Divider>

          <div style={{ textAlign: 'center' }}>
            <Paragraph style={{ color: '#6B7280', fontSize: '15px', marginBottom: 0 }}>
              Đã có tài khoản?{' '}
              <Link 
                to="/login"
                style={{ 
                  color: '#4F46E5', 
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                Đăng nhập
              </Link>
            </Paragraph>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default RegisterPage;
