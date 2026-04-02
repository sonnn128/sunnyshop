import React, { useEffect, useState } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Row, Col, Empty, Button, Spin, message } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { wishlistService } from '@/services/wishlist.service';
import AddToCartButton from '@/components/AddToCartButton';

const { Title, Text } = Typography;

const WishlistPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            const res = await wishlistService.getMyWishlist();
            setProducts(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error(error);
            message.error('Tải danh sách thất bại');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await wishlistService.removeFromWishlist(productId);
            message.success('Đã xóa khỏi danh sách yêu thích');
            setProducts(products.filter(p => p.id !== productId));
        } catch (e) {
            message.error('Xóa thất bại');
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', minHeight: '80vh' }}>
            <Title level={2} style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', color: '#111827' }}>
                Danh Sách Yêu Thích
            </Title>
            <Text style={{ color: '#6B7280', fontSize: '16px', display: 'block', marginBottom: '40px' }}>
                Những sản phẩm bạn đã lưu lại để mua sắm sau.
            </Text>

            {products.length === 0 ? (
                <Empty 
                    description={<span style={{ fontSize: '16px', color: '#6B7280' }}>Danh sách yêu thích của bạn đang trống</span>} 
                    style={{ padding: '60px 0', background: '#F9FAFB', borderRadius: '16px' }}
                />
            ) : (
                <Row gutter={[24, 24]}>
                    {products.map(product => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                            <Card
                                hoverable
                                style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #F3F4F6' }}
                                bodyStyle={{ padding: '20px' }}
                                cover={
                                    <div style={{ background: '#F9FAFB', display: 'flex', justifyContent: 'center', padding: '20px' }} onClick={() => navigate(`/products/${product.id}`)}>
                                        <img
                                            alt={product.name}
                                            src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                            style={{ height: '200px', width: '100%', objectFit: 'contain', cursor: 'pointer', transition: 'transform 0.3s ease' }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                }
                                actions={[
                                    <AddToCartButton product={product} compact={true} />,
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeFromWishlist(product.id)}
                                        title="Xóa"
                                    />
                                ]}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <Text 
                                        style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}
                                    >
                                        {product.factory || 'Thương Hiệu'}
                                    </Text>
                                    <div 
                                        onClick={() => navigate(`/products/${product.id}`)} 
                                        style={{ cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#111827', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '48px', lineHeight: '24px' }}
                                        onMouseEnter={(e) => e.target.style.color = '#4F46E5'}
                                        onMouseLeave={(e) => e.target.style.color = '#111827'}
                                    >
                                        {product.name}
                                    </div>
                                    <Text strong style={{ color: '#111827', fontSize: '18px' }}>
                                        {formatPrice(product.price)}
                                    </Text>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default WishlistPage;
