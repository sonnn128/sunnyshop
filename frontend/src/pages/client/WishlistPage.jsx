import React, { useEffect, useState } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Row, Col, Empty, Button, Spin, message, Rate, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EyeOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { wishlistService } from '@/services/wishlist.service';
import { useWishlist } from '@/contexts/WishlistContext.jsx';

const { Title, Text, Paragraph } = Typography;

const WishlistPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { remove } = useWishlist();

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            const res = await wishlistService.getMyWishlist();
            setProducts(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Failed to load wishlist:', error);
            message.error('Tải danh sách yêu thích thất bại');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (product) => {
        try {
            remove(product.id);
            setProducts(prev => prev.filter(p => p.id !== product.id));
            message.success('Đã xóa khỏi danh sách yêu thích');
        } catch (e) {
            console.error(e);
            message.error('Xóa thất bại');
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" tip="Đang tải danh sách yêu thích..." />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 20px 80px', minHeight: '80vh' }}>
            {/* Header section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Title level={2} style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#111827' }}>
                            Danh Sách Yêu Thích
                        </Title>
                        <Tag color="red" style={{ borderRadius: '12px', padding: '2px 10px', fontSize: '13px', fontWeight: 600 }}>
                            {products.length} sản phẩm
                        </Tag>
                    </div>
                    <Text style={{ color: '#6B7280', fontSize: '15px', marginTop: '6px', display: 'block' }}>
                        Các sản phẩm bạn đã lưu lại để tiện theo dõi và mua sắm sau.
                    </Text>
                </div>

                {products.length > 0 && (
                    <Button 
                        icon={<ShoppingOutlined />}
                        onClick={() => navigate('/products')} 
                        style={{ borderRadius: '8px', height: '40px', fontWeight: 500 }}
                    >
                        Tiếp tục mua sắm
                    </Button>
                )}
            </div>

            {/* Empty State */}
            {products.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '80px 20px', 
                    backgroundColor: '#fff', 
                    borderRadius: '20px', 
                    border: '1px dashed #E5E7EB',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)' 
                }}>
                    <div style={{ fontSize: '56px', marginBottom: '16px' }}>❤️</div>
                    <Title level={3} style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                        Danh sách yêu thích đang trống
                    </Title>
                    <Paragraph style={{ color: '#6B7280', fontSize: '15px', maxWidth: '420px', margin: '0 auto 24px auto' }}>
                        Hãy thả tim các món đồ thời trang bạn yêu thích khi duyệt sản phẩm để lưu lại tại đây nhé!
                    </Paragraph>
                    <Button
                        type="primary"
                        size="large"
                        icon={<ShoppingOutlined />}
                        onClick={() => navigate('/products')}
                        style={{ 
                            borderRadius: '8px', 
                            fontWeight: 600, 
                            backgroundColor: '#ee4d2d', 
                            borderColor: '#ee4d2d', 
                            height: '44px', 
                            padding: '0 32px' 
                        }}
                    >
                        Khám phá sản phẩm ngay
                    </Button>
                </div>
            ) : (
                /* Products Grid */
                <Row gutter={[24, 28]}>
                    {products.map(product => {
                        const discountPercent = product.id && product.id % 3 !== 0 ? 15 + (product.id % 5) * 10 : 0;
                        const oldPrice = discountPercent > 0 ? product.price * (100 / (100 - discountPercent)) : null;
                        const rating = product.averageRating !== undefined && product.averageRating !== null
                            ? product.averageRating
                            : 5.0;

                        return (
                            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                <Card
                                    hoverable
                                    style={{
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        border: '1px solid #F3F4F6',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                                        transition: 'all 0.3s ease',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    styles={{ 
                                        body: { 
                                            padding: '16px', 
                                            flex: 1, 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            justifyContent: 'space-between' 
                                        } 
                                    }}
                                    cover={
                                        <div style={{ overflow: 'hidden', backgroundColor: '#F9FAFB', position: 'relative', height: '240px' }}>
                                            <img
                                                alt={product.name}
                                                src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                                style={{
                                                    height: '100%',
                                                    width: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.4s ease',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                onClick={() => navigate(`/products/${product.id}`)}
                                            />

                                            {/* Discount Tag */}
                                            {discountPercent > 0 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    left: '12px',
                                                    backgroundColor: '#ee4d2d',
                                                    color: '#fff',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    boxShadow: '0 2px 6px rgba(238, 77, 45, 0.3)'
                                                }}>
                                                    -{discountPercent}%
                                                </div>
                                            )}

                                            {/* Remove from Wishlist Button */}
                                            <Tooltip title="Xóa khỏi danh sách yêu thích">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemove(product);
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '12px',
                                                        right: '12px',
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                                                        backdropFilter: 'blur(4px)',
                                                        border: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseOver={e => {
                                                        e.currentTarget.style.backgroundColor = '#FEE2E2';
                                                        e.currentTarget.style.transform = 'scale(1.1)';
                                                    }}
                                                    onMouseOut={e => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <DeleteOutlined style={{ color: '#EF4444', fontSize: '15px' }} />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    }
                                >
                                    <div>
                                        {/* Brand tag */}
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: '#9CA3AF', 
                                            textTransform: 'uppercase', 
                                            letterSpacing: '0.8px', 
                                            fontWeight: 600, 
                                            marginBottom: '4px' 
                                        }}>
                                            {product.factory || 'TrendWear'}
                                        </div>

                                        {/* Product Name */}
                                        <div
                                            onClick={() => navigate(`/products/${product.id}`)}
                                            style={{
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: '#111827',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                height: '40px',
                                                lineHeight: '20px',
                                                marginBottom: '8px',
                                                transition: 'color 0.2s ease'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.color = '#ee4d2d'}
                                            onMouseOut={e => e.currentTarget.style.color = '#111827'}
                                        >
                                            {product.name}
                                        </div>

                                        {/* Rating */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                                            <Rate disabled allowHalf value={rating} style={{ fontSize: '11px', color: '#FBBF24' }} />
                                            <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>
                                                ({product.reviewCount || 0})
                                            </span>
                                        </div>

                                        {/* Price Row */}
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                                            <span style={{ fontSize: '17px', fontWeight: 700, color: '#ee4d2d' }}>
                                                {formatPrice(product.price)}
                                            </span>
                                            {oldPrice && (
                                                <Text delete style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                                    {formatPrice(oldPrice)}
                                                </Text>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button: Xem chi tiết */}
                                    <Button
                                        type="primary"
                                        onClick={() => navigate(`/products/${product.id}`)}
                                        style={{
                                            width: '100%',
                                            height: '38px',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            fontSize: '13px',
                                            backgroundColor: '#111827',
                                            borderColor: '#111827',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <EyeOutlined /> Xem chi tiết
                                    </Button>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </div>
    );
};

export default WishlistPage;
