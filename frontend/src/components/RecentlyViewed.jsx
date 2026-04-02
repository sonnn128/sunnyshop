import React, { useEffect, useState } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

import { getRecentViews } from '@/utils/recentViews.js';

const { Title, Text } = Typography;

const RecentlyViewed = ({ limit = 4 }) => {
    const [recentProducts, setRecentProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setRecentProducts(getRecentViews());
    }, []);

    if (recentProducts.length === 0) return null;

    return (
        <div style={{ marginTop: 40 }}>
            <Title level={3}>Recently Viewed</Title>
            <Row gutter={[16, 16]}>
                {recentProducts.slice(0, limit).map(product => (
                    <Col xs={24} sm={12} md={6} key={product.id}>
                        <Card
                            hoverable
                            cover={
                                <img
                                    alt={product.name}
                                    src={product.image || 'https://via.placeholder.com/300x200'}
                                    style={{ height: 150, objectFit: 'cover' }}
                                    onClick={() => navigate(`/products/${product.id}`)}
                                />
                            }
                        >
                            <Card.Meta
                                title={
                                    <div onClick={() => navigate(`/products/${product.id}`)} style={{ cursor: 'pointer' }}>
                                        {product.name}
                                    </div>
                                }
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
        </div>
    );
};

export default RecentlyViewed;
