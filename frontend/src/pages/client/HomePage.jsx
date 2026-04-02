import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Button, Row, Col, Spin, message, Badge, Carousel } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingOutlined, FireOutlined, EyeOutlined, HeartOutlined, ArrowRightOutlined, SkinOutlined } from '@ant-design/icons';
import AddToCartButton from '@/components/AddToCartButton.jsx';
import { productService } from '@/services/product.service.js';
import RecentlyViewed from '@/components/RecentlyViewed.jsx';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const features = [
        {
            title: 'Bộ Sưu Tập Cao Cấp',
            description: 'Khám phá các dòng sản phẩm thời trang phong cách độc quyền được chế tác tỉ mỉ từ những chất liệu tốt nhất.',
            icon: <SkinOutlined style={{ fontSize: '36px', color: '#4F46E5' }} />,
            bgColor: '#EEF2FF',
        },
        {
            title: 'Phong Cách Dẫn Đầu',
            description: 'Luôn đi trước xu hướng với các bộ sưu tập theo mùa liên tục được cập nhật hàng tuần.',
            icon: <FireOutlined style={{ fontSize: '36px', color: '#10B981' }} />,
            bgColor: '#D1FAE5',
        },
        {
            title: 'Thiết Kế Cho Riêng Bạn',
            description: 'Trải nghiệm thời trang với sự cân bằng hoàn hảo giữa thoải mái, thanh lịch và tự tin.',
            icon: <HeartOutlined style={{ fontSize: '36px', color: '#F59E0B' }} />,
            bgColor: '#FEF3C7',
        },
    ];

    useEffect(() => {
        loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async () => {
        try {
            setLoading(true);
            const result = await productService.getAll({
                page: 0,
                size: 8,
                sort: 'id,desc'
            });
            const data = result.data || result;

            if (Array.isArray(data)) {
                setFeaturedProducts(data.filter(p => (p.quantity ?? p.stock ?? 0) > 0));
            } else if (data.content) {
                setFeaturedProducts(data.content.filter(p => (p.quantity ?? p.stock ?? 0) > 0));
            }
        } catch (error) {
            console.error('Error loading featured products:', error);
            message.error('Failed to load featured products');
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    return (
        <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            {/* Global Styles */}
            <style>{`
                .hero-carousel .slick-dots li button {
                    height: 4px;
                    border-radius: 2px;
                    background: rgba(255, 255, 255, 0.5);
                }
                .hero-carousel .slick-dots li.slick-active button {
                    background: #fff;
                    width: 24px;
                }
                .hero-slide {
                    position: relative;
                    min-height: 85vh;
                    display: flex !important;
                    align-items: center;
                    background-size: cover;
                    background-position: center;
                    border-radius: 0 0 40px 40px;
                    overflow: hidden;
                    outline: none;
                }
                .hero-carousel {
                    margin-bottom: 80px;
                    border-radius: 0 0 40px 40px;
                    overflow: hidden;
                    position: relative;
                }
                .hero-carousel .slick-prev,
                .hero-carousel .slick-next {
                    width: 50px !important;
                    height: 50px !important;
                    background: rgba(255, 255, 255, 0.2) !important;
                    border-radius: 50% !important;
                    z-index: 2;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(4px);
                }
                .hero-carousel .slick-prev {
                    left: 20px;
                }
                .hero-carousel .slick-next {
                    right: 20px;
                }
                .hero-carousel .slick-prev:hover,
                .hero-carousel .slick-next:hover {
                    background: rgba(255, 255, 255, 0.4);
                    transform: scale(1.1);
                }
                .hero-carousel .slick-prev:before,
                .hero-carousel .slick-next:before {
                    font-size: 24px !important;
                    opacity: 1 !important;
                    color: white !important;
                    position: absolute !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    line-height: 1 !important;
                }
                .hero-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(to right, rgba(17, 24, 39, 0.9) 0%, rgba(17, 24, 39, 0.4) 100%);
                }
                .hero-content {
                    position: relative;
                    z-index: 1;
                    padding: 0 5%;
                    max-width: 800px;
                    width: 100%;
                }
                .feature-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border: none;
                    border-radius: 20px;
                    height: 100%;
                }
                .feature-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.06);
                }
                .product-card {
                    transition: all 0.3s ease;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid #F3F4F6;
                }
                .product-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                    border-color: transparent;
                }
                .product-image-container {
                    overflow: hidden;
                    background: #F9FAFB;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 240px;
                }
                .product-image-container img {
                    transition: transform 0.5s ease;
                    max-height: 100%;
                    max-width: 100%;
                    object-fit: contain;
                }
                .product-card:hover .product-image-container img {
                    transform: scale(1.08);
                }
                .cta-section {
                    background: linear-gradient(135deg, #111827 0%, #374151 100%);
                    border-radius: 24px;
                    color: white;
                    padding: 80px 40px;
                    margin: 80px 5%;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                .cta-bg-shape {
                    position: absolute;
                    top: -50%;
                    left: -10%;
                    width: 50%;
                    height: 200%;
                    background: rgba(255,255,255,0.05);
                    transform: rotate(30deg);
                }
            `}</style>

            {/* Hero Section Carousel */}
            <Carousel autoplay effect="fade" className="hero-carousel" dots={{ className: 'slick-dots' }} autoplaySpeed={5000} arrows={true}>
                {/* Slide 1 */}
                <div>
                    <div className="hero-slide" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80')" }}>
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                            <Badge 
                                count="BỘ SƯU TẬP MÙA HÈ" 
                                style={{ backgroundColor: '#4F46E5', color: '#fff', fontSize: '12px', padding: '0 12px', height: '24px', lineHeight: '24px', borderRadius: '12px', marginBottom: '24px' }} 
                            />
                            <Title level={1} style={{ color: 'white', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
                                Tỏa Sáng Dưới Nắng Hè
                            </Title>
                            <Paragraph style={{ color: '#D1D5DB', fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px' }}>
                                Trải nghiệm những trang phục tươi trẻ, thoáng mát nhưng không kém phần thanh lịch được thiết kế riêng cho mùa hè này.
                            </Paragraph>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <Button 
                                    type="primary" 
                                    size="large" 
                                    onClick={() => navigate('/products')}
                                    style={{ height: '56px', padding: '0 32px', borderRadius: '28px', fontSize: '16px', fontWeight: 600, backgroundColor: '#4F46E5', border: 'none' }}
                                >
                                    Khám Phá Ngay <ArrowRightOutlined />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide 2 */}
                <div>
                    <div className="hero-slide" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80')" }}>
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                            <Badge 
                                count="HÀNG MỚI VỀ" 
                                style={{ backgroundColor: '#10B981', color: '#fff', fontSize: '12px', padding: '0 12px', height: '24px', lineHeight: '24px', borderRadius: '12px', marginBottom: '24px' }} 
                            />
                            <Title level={1} style={{ color: 'white', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
                                Phong Cách Công Sở <br/> Hiện Đại
                            </Title>
                            <Paragraph style={{ color: '#D1D5DB', fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px' }}>
                                Định hình phong thái chuyên nghiệp với bộ sưu tập công sở cao cấp. Tự tin bước vào mọi cuộc họp với thiết kế đẳng cấp.
                            </Paragraph>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <Button 
                                    type="primary" 
                                    size="large" 
                                    onClick={() => navigate('/products')}
                                    style={{ height: '56px', padding: '0 32px', borderRadius: '28px', fontSize: '16px', fontWeight: 600, backgroundColor: '#10B981', border: 'none' }}
                                >
                                    Mua Sắm Bộ Sưu Tập <ArrowRightOutlined />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide 3 */}
                <div>
                    <div className="hero-slide" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80')" }}>
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                            <Badge 
                                count="PHONG CÁCH SỐNG" 
                                style={{ backgroundColor: '#F59E0B', color: '#fff', fontSize: '12px', padding: '0 12px', height: '24px', lineHeight: '24px', borderRadius: '12px', marginBottom: '24px' }} 
                            />
                            <Title level={1} style={{ color: 'white', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
                                Thoải Mái Đón Đầu <br/> Xu Hướng
                            </Title>
                            <Paragraph style={{ color: '#D1D5DB', fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px' }}>
                                Sự kết hợp tinh tế giữa tính thực dụng và thời trang dạo phố cao cấp. Khẳng định cá tính qua từng trang phục.
                            </Paragraph>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <Button 
                                    size="large" 
                                    onClick={() => navigate('/products')}
                                    style={{ height: '56px', padding: '0 32px', borderRadius: '28px', fontSize: '16px', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)' }}
                                >
                                    Xem Các Xu Hướng Mới
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Carousel>

            {/* Main Container */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5%' }}>
                {/* Features Section */}
                <Row gutter={[32, 32]} style={{ marginBottom: '100px' }}>
                    {features.map((feature, index) => (
                        <Col xs={24} md={8} key={index}>
                            <Card className="feature-card">
                                <div style={{ 
                                    width: '72px', 
                                    height: '72px', 
                                    borderRadius: '20px', 
                                    backgroundColor: feature.bgColor, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    marginBottom: '24px'
                                }}>
                                    {feature.icon}
                                </div>
                                <Title level={3} style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>{feature.title}</Title>
                                <Paragraph style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.6 }}>{feature.description}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Featured Products Section */}
                <div style={{ marginBottom: '100px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                        <div>
                            <Title level={2} style={{ fontSize: '36px', fontWeight: 800, margin: 0 }}>
                                Sản Phẩm Xu Hướng
                            </Title>
                            <Paragraph style={{ color: '#6B7280', fontSize: '16px', marginTop: '8px', marginBottom: 0 }}>
                                Những món đồ thời trang được săn đón nhất tuần này
                            </Paragraph>
                        </div>
                        <Button type="link" onClick={() => navigate('/products')} style={{ fontSize: '16px', fontWeight: 600, color: '#4F46E5', padding: 0 }}>
                            Xem tất cả <ArrowRightOutlined />
                        </Button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <Spin size="large" />
                            <div style={{ marginTop: '16px', color: '#6B7280' }}>Đang lấy danh sách sản phẩm...</div>
                        </div>
                    ) : (
                        <Row gutter={[24, 32]}>
                            {featuredProducts.map(product => (
                                <Col xs={24} sm={12} lg={6} key={product.id}>
                                    <Card
                                        className="product-card"
                                        bodyStyle={{ padding: '24px' }}
                                        cover={
                                            <div 
                                                className="product-image-container"
                                                onClick={() => handleProductClick(product.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    alt={product.name}
                                                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                                    loading="lazy"
                                                />
                                            </div>
                                        }
                                    >
                                        <div style={{ marginBottom: '16px' }}>
                                            <Text style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                                                {product.factory || 'Thương Hiệu Độc Quyền'}
                                            </Text>
                                            <Title level={4} style={{ margin: '8px 0', fontSize: '18px', lineHeight: 1.4, height: '50px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                <div
                                                    onClick={() => handleProductClick(product.id)}
                                                    style={{ cursor: 'pointer', color: '#111827', transition: 'color 0.2s' }}
                                                    onMouseEnter={(e) => e.target.style.color = '#4F46E5'}
                                                    onMouseLeave={(e) => e.target.style.color = '#111827'}
                                                >
                                                    {product.name}
                                                </div>
                                            </Title>
                                            <Text strong style={{ fontSize: '20px', color: '#111827' }}>
                                                {formatPrice(product.price)}
                                            </Text>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', height: '40px' }}>
                                            <Button
                                                type="default"
                                                icon={<EyeOutlined />}
                                                onClick={() => handleProductClick(product.id)}
                                                style={{ flex: 1, borderRadius: '8px', height: '100%', padding: '0 8px' }}
                                            >
                                                Chi tiết
                                            </Button>
                                            <div style={{ flex: 1, height: '100%' }}>
                                                <AddToCartButton
                                                    product={product}
                                                    showQuantity={false}
                                                    compact={true}
                                                    size="large"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <div className="cta-bg-shape"></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Title level={2} style={{ color: 'white', fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>
                        Sẵn Sàng Nâng Cấp Tủ Đồ Của Bạn?
                    </Title>
                    <Paragraph style={{ color: '#9CA3AF', fontSize: '18px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
                        Gia nhập cộng đồng những người đam mê thời trang đã định hình lại phong cách cá nhân của họ. Trải nghiệm sự thanh lịch vô song ngay hôm nay.
                    </Paragraph>
                    <Button 
                        type="primary" 
                        size="large" 
                        onClick={() => navigate('/products')}
                        style={{ height: '56px', padding: '0 40px', borderRadius: '28px', fontSize: '18px', fontWeight: 600, backgroundColor: '#fff', color: '#111827', border: 'none' }}
                    >
                        Khám Phá Cửa Hàng
                    </Button>
                </div>
            </div>

            {/* Recent Views */}
            <div style={{ maxWidth: '1400px', margin: '0 auto 80px auto', padding: '0 5%' }}>
                <RecentlyViewed limit={4} />
            </div>
        </div>
    );
};

export default HomePage;
