import React, { useEffect, useState } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Row, Col, Typography, Empty } from 'antd';
import { getRecentViews } from '../utils/recentViews.js';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const RecentViews = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getRecentViews().slice(0, 6));
  }, []);

  if (!items || items.length === 0) return <Empty description="No recent views" />;

  return (
    <div style={{ marginTop: 24 }}>
      <Title level={4}>Recently Viewed</Title>
      <Row gutter={[16, 16]}>
        {items.map(p => (
          <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt={p.name} src={p.image || 'https://via.placeholder.com/300x200?text=No+Image'} style={{ height: 120, objectFit: 'cover' }} />}
              onClick={() => navigate(`/products/${p.id}`)}
            >
              <div style={{ fontWeight: 'bold' }}>{p.name}</div>
              <div style={{ color: '#666', fontSize: 12 }}>{formatPrice(p.price)}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RecentViews;
