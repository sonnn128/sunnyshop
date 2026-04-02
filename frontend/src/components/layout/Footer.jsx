import React from 'react';
import { Typography, Row, Col, Space } from 'antd';
import { 
  FacebookOutlined, 
  InstagramOutlined, 
  TwitterOutlined, 
  YoutubeOutlined,
  SkinOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Footer = () => {
  return (
    <footer style={{ background: '#111827', color: '#fff', padding: '60px 5% 20px 5%', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Row gutter={[48, 32]}>
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 40,
                height: 40,
                background: '#4F46E5',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.4)'
              }}>
                <SkinOutlined style={{ color: '#fff', fontSize: 22 }} />
              </div>
              <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Sunny Shop
              </span>
            </div>
            <Text style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.6, display: 'block', marginBottom: 24 }}>
              Nâng tầm phong cách cá nhân của bạn với những bộ sưu tập thời trang độc quyền. Chúng tôi cam kết mang đến chất lượng và sự thanh lịch trong từng thiết kế.
            </Text>
            <Space size="middle">
              <a href="#" style={{ color: '#9CA3AF', fontSize: '20px', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}><FacebookOutlined /></a>
              <a href="#" style={{ color: '#9CA3AF', fontSize: '20px', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}><InstagramOutlined /></a>
              <a href="#" style={{ color: '#9CA3AF', fontSize: '20px', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}><TwitterOutlined /></a>
              <a href="#" style={{ color: '#9CA3AF', fontSize: '20px', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}><YoutubeOutlined /></a>
            </Space>
          </Col>
          
          <Col xs={24} sm={8} md={5}>
            <Title level={4} style={{ color: '#fff', marginBottom: 24, fontSize: '18px' }}>Chăm Sóc Khách Hàng</Title>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li><Link to="/help" style={{ color: '#9CA3AF', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#4F46E5'} onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Trung tâm hỗ trợ</Link></li>
              <li><Link to="/shipping" style={{ color: '#9CA3AF', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#4F46E5'} onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Chính sách vận chuyển</Link></li>
              <li><Link to="/returns" style={{ color: '#9CA3AF', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#4F46E5'} onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Chính sách đổi trả</Link></li>
              <li><Link to="/faq" style={{ color: '#9CA3AF', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#4F46E5'} onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Câu hỏi thường gặp</Link></li>
            </ul>
          </Col>

          <Col xs={24} sm={8} md={5}>
            <Title level={4} style={{ color: '#fff', marginBottom: 24, fontSize: '18px' }}>Về Sunny Shop</Title>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li><Link to="/about" style={{ color: '#9CA3AF', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#4F46E5'} onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Câu chuyện thương hiệu</Link></li>
              <li><Link to="/careers" style={{ color: '#9CA3AF', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#4F46E5'} onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Tuyển dụng</Link></li>
              <li><Link to="/terms" style={{ color: '#9CA3AF', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#4F46E5'} onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Điều khoản sử dụng</Link></li>
              <li><Link to="/privacy" style={{ color: '#9CA3AF', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#4F46E5'} onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>Chính sách bảo mật</Link></li>
            </ul>
          </Col>

          <Col xs={24} sm={8} md={6}>
            <Title level={4} style={{ color: '#fff', marginBottom: 24, fontSize: '18px' }}>Liên Hệ</Title>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <EnvironmentOutlined style={{ color: '#4F46E5', fontSize: '18px' }} />
                <span style={{ color: '#9CA3AF' }}>123 Đường Thời Trang, Quận 1, TP. HCM</span>
              </li>
              <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <PhoneOutlined style={{ color: '#4F46E5', fontSize: '18px' }} />
                <span style={{ color: '#9CA3AF' }}>0123 456 789</span>
              </li>
              <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <MailOutlined style={{ color: '#4F46E5', fontSize: '18px' }} />
                <span style={{ color: '#9CA3AF' }}>contact@sunnyshop.com</span>
              </li>
            </ul>
          </Col>
        </Row>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 40, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Text style={{ color: '#6B7280' }}>
            © {new Date().getFullYear()} Sunny Shop. All rights reserved. Created by Son Nguyen.
          </Text>
          <div style={{ display: 'flex', gap: 16 }}>
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" style={{ height: 20, filter: 'grayscale(1) brightness(2)' }} />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" style={{ height: 20, filter: 'grayscale(1) brightness(2)' }} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
