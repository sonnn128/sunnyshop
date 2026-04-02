import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Button, Row, Col, Spin, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LaptopOutlined, ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
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
            title: 'Latest Laptops',
            description: 'Discover the newest laptop models with cutting-edge technology',
            icon: <LaptopOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
        },
        {
            title: 'Easy Shopping',
            description: 'Simple and secure shopping experience with fast checkout',
            icon: <ShoppingCartOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
        },
        {
            title: 'Quality Guarantee',
            description: 'All products come with warranty and quality assurance',
            icon: <LaptopOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />,
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
                size: 6,
                sort: 'id,desc'
            });
            const data = result.data || result;

            if (Array.isArray(data)) {
                // Filter out out-of-stock products
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
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '80px 0',
                textAlign: 'center',
                marginBottom: '60px',
                borderRadius: '8px'
            }}>
                <Title level={1} style={{ color: 'white', fontSize: '3rem', marginBottom: '20px' }}>
                    Welcome to Sunny Shop
                </Title>
                <Paragraph style={{ color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
                    Discover the latest laptops with the best prices and quality guarantee
                </Paragraph>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Button type="primary" size="large" href="/products">
                        Browse Products
                    </Button>
                    <Button size="large" href="/login" style={{ color: 'white', borderColor: 'white' }}>
                        Login
                    </Button>
                </div>
            </div>

            {/* Features Section */}
            <Row gutter={[24, 24]} style={{ marginBottom: '60px' }}>
                {features.map((feature, index) => (
                    <Col xs={24} md={8} key={index}>
                        <Card
                            hoverable
                            style={{ textAlign: 'center', height: '100%' }}
                            bodyStyle={{ padding: '40px 24px' }}
                        >
                            <div style={{ marginBottom: '24px' }}>
                                {feature.icon}
                            </div>
                            <Title level={3}>{feature.title}</Title>
                            <Paragraph>{feature.description}</Paragraph>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Featured Products Section */}
            <div style={{ marginBottom: '60px' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
                    Featured Products
                </Title>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin size="large" />
                        <div style={{ marginTop: '16px' }}>Loading featured products...</div>
                    </div>
                ) : (
                    <Row gutter={[16, 16]}>
                        {featuredProducts.map(product => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={product.name}
                                            src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                            style={{ height: 200, objectFit: 'cover' }}
                                            onClick={() => handleProductClick(product.id)}
                                        />
                                    }
                                    actions={[
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0 8px' }}>
                                            <Button
                                                type="text"
                                                icon={<EyeOutlined />}
                                                onClick={() => handleProductClick(product.id)}
                                                size="small"
                                            >
                                                View
                                            </Button>
                                            <AddToCartButton
                                                product={product}
                                                size="small"
                                                showQuantity={false}
                                                compact={true}
                                            />
                                        </div>
                                    ]}
                                >
                                    <Card.Meta
                                        title={
                                            <div
                                                onClick={() => handleProductClick(product.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {product.name}
                                            </div>
                                        }
                                        description={
                                            <div>
                                                <div style={{ marginBottom: '8px' }}>
                                                    <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                                                        {formatPrice(product.price)}
                                                    </Text>
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    {product.factory && `by ${product.factory}`}
                                                </div>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                {!loading && featuredProducts.length > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                        <Button type="primary" size="large" onClick={() => navigate('/products')}>
                            View All Products
                        </Button>
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <Card style={{ textAlign: 'center' }}>
                <Title level={2}>Ready to Find Your Perfect Laptop?</Title>
                <Paragraph style={{ fontSize: '1.1rem', marginBottom: '32px' }}>
                    Browse our extensive collection of laptops from top brands
                </Paragraph>
                <Button type="primary" size="large" onClick={() => navigate('/products')}>
                    Shop Now
                </Button>
            </Card>

            {/* Recent Views */}
            <RecentlyViewed limit={6} />
        </div>
    );
};

export default HomePage;
