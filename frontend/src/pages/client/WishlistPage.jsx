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
            message.error('Failed to load wishlist');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await wishlistService.removeFromWishlist(productId);
            message.success('Removed from wishlist');
            setProducts(products.filter(p => p.id !== productId));
        } catch (e) {
            message.error('Failed to remove');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
    }

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>My Wishlist</Title>
            {products.length === 0 ? (
                <Empty description="Your wishlist is empty" />
            ) : (
                <Row gutter={[16, 16]}>
                    {products.map(product => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={product.name}
                                        src={product.image || 'https://via.placeholder.com/300x200'}
                                        style={{ height: 200, objectFit: 'cover' }}
                                        onClick={() => navigate(`/products/${product.id}`)}
                                    />
                                }
                                actions={[
                                    <AddToCartButton product={product} size="small" compact />,
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeFromWishlist(product.id)}
                                    />
                                ]}
                            >
                                <Card.Meta
                                    title={<div onClick={() => navigate(`/products/${product.id}`)} style={{ cursor: 'pointer' }}>{product.name}</div>}
                                    description={
                                        <Text strong style={{ color: '#1890ff' }}>
                                            {formatPrice(product.price)}
                                        </Text>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default WishlistPage;
