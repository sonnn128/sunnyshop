import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Divider, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, ShoppingOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const { Title, Paragraph, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values.username, values.password);
      if (result.success) {
        message.success('Login successful!');

        const user = result.data.user || result.data.data.user;
        const isAdmin = user?.roles?.some(r => r.name === 'ADMIN' || r.name === 'ROLE_ADMIN') || user?.role === 'ADMIN';

        if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Login failed. Please try again.');
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'auto', alignSelf: 'flex-start' }}>
             <ShoppingOutlined style={{ fontSize: '32px', color: '#fff' }} />
             <span style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>Sunny Shop</span>
          </div>
          
          <div style={{ maxWidth: '480px' }}>
            <Title level={1} style={{ color: '#fff', fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
              Discover the new standard of shopping.
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '18px', lineHeight: 1.6 }}>
              Join thousands of satisfied customers who have revolutionized their style with our premium, curated collections.
            </Paragraph>
          </div>
          
          <div style={{ marginTop: 'auto', display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '24px' }}>
             <div style={{ display: 'flex' }}>
               {[...Array(5)].map((_, i) => (
                 <div key={i} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', marginLeft: i > 0 ? -12 : 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <UserOutlined style={{ color: '#666' }} />
                 </div>
               ))}
             </div>
             <Text style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Join 10,000+ shoppers</Text>
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
          
          {/* Mobile Header Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }} className="mobile-branding">
            {/* Displayed primarily on small screens if needed, but handled organically */}
          </div>

          <div style={{ marginBottom: '40px' }}>
            <Title level={2} style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              Welcome back
            </Title>
            <Paragraph style={{ color: '#6B7280', fontSize: '16px' }}>
              Please enter your details to sign in.
            </Paragraph>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Username</span>}
              rules={[{ required: true, message: 'Please enter your username!' }]}
              style={{ marginBottom: '24px' }}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />}
                placeholder="Enter your username"
                size="large"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                  fontSize: '15px'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Password</span>}
              rules={[{ required: true, message: 'Please enter your password!' }]}
              style={{ marginBottom: '16px' }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9CA3AF', marginRight: '8px' }} />}
                placeholder="••••••••"
                size="large"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                  fontSize: '15px'
                }}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
              <Link 
                to="/forgot-password"
                style={{ 
                  color: '#4F46E5', 
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Forgot password?
              </Link>
            </div>

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
                <span>Sign in</span>
                {!loading && <ArrowRightOutlined style={{ marginLeft: '8px', fontSize: '14px' }} />}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ color: '#9CA3AF', fontSize: '14px', margin: '32px 0' }}>or continue with</Divider>

          <div style={{ textAlign: 'center' }}>
            <Paragraph style={{ color: '#6B7280', fontSize: '15px', marginBottom: 0 }}>
              Don't have an account?{' '}
              <Link 
                to="/register"
                style={{ 
                  color: '#4F46E5', 
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                Sign up
              </Link>
            </Paragraph>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default LoginPage;

