import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../../lib/api';
import { Card, Button, Space, Row, Col, Spin, Divider, Tag, Image as AntImage, Descriptions, Empty } from 'antd';
import { ArrowLeftOutlined, EditOutlined, FolderOutlined, CalendarOutlined } from '@ant-design/icons';

const normalizeCategory = (category = {}) => {
  return {
    ...category,
    _id: category?._id ?? category?.id,
    image_url: category?.image_url ?? category?.imageUrl ?? '',
    sort_order: category?.sort_order ?? category?.sortOrder ?? 0,
    is_active: category?.is_active ?? category?.isActive ?? category?.active ?? true,
    is_featured: category?.is_featured ?? category?.isFeatured ?? category?.featured ?? false
  };
};

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get(`/api/categories/${id}`);
        const data = res?.data?.data ?? res?.data?.category ?? res?.data;
        if (mounted) {
          setCategory(data ? normalizeCategory(data) : null);
        }
      } catch (error) {
        console.error('Load category error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px' }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (!category) {
    return (
      <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Empty description="Không tìm thấy danh mục" style={{ marginTop: '20px' }} />
        <Button 
          type="primary" 
          size="large"
          style={{ marginTop: '24px' }}
          onClick={() => navigate('/admin?tab=categories')}
        >
          <ArrowLeftOutlined /> Quay lại
        </Button>
      </Card>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }} align="middle">
          <Col>
            <Button 
              type="primary" 
              ghost 
              shape="round"
              onClick={() => navigate('/admin?tab=categories')}
              icon={<ArrowLeftOutlined />}
            >
              Quay lại
            </Button>
          </Col>
          <Col flex="auto">
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
              <FolderOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              Chi Tiết Danh Mục
            </h1>
          </Col>
          <Col>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate(`/admin/categories/${id}`)}
              icon={<EditOutlined />}
            >
              Chỉnh Sửa
            </Button>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          {/* Left Column - Image & Basic Info */}
          <Col xs={24} md={8}>
            <Card style={{ height: '100%' }}>
              {/* Image */}
              {category.image_url && (
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                  <AntImage
                    width={250}
                    height={250}
                    src={category.image_url}
                    alt={category.name}
                    preview
                    style={{ borderRadius: '8px', border: '1px solid #d9d9d9' }}
                  />
                </div>
              )}

              {/* Status Badges */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {category.is_active && (
                  <Tag color="green" style={{ fontSize: '12px', padding: '4px 12px' }}>
                    ✓ Hoạt động
                  </Tag>
                )}
                {!category.is_active && (
                  <Tag color="red" style={{ fontSize: '12px', padding: '4px 12px' }}>
                    ✗ Không hoạt động
                  </Tag>
                )}
                {category.is_featured && (
                  <Tag color="gold" style={{ fontSize: '12px', padding: '4px 12px' }}>
                    ★ Nổi bật
                  </Tag>
                )}
              </div>

              <Divider />

              {/* Quick Stats */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#999' }}>Thứ tự</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    #{category.sort_order || 0}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Slug</div>
                  <code style={{ 
                    fontSize: '13px', 
                    backgroundColor: '#f5f5f5', 
                    padding: '8px 12px', 
                    borderRadius: '4px', 
                    display: 'inline-block',
                    marginTop: '4px'
                  }}>
                    /{category.slug}
                  </code>
                </div>
              </div>
            </Card>
          </Col>

          {/* Right Column - Details */}
          <Col xs={24} md={16}>
            <Card>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
                {category.name}
              </h2>

              {/* Detailed Info */}
              <Descriptions
                bordered
                column={1}
                size="middle"
                labelStyle={{ backgroundColor: '#fafafa', fontWeight: '600', width: '180px' }}
              >
                <Descriptions.Item label="Tên Danh Mục">
                  <strong>{category.name}</strong>
                </Descriptions.Item>

                <Descriptions.Item label="Slug (URL)">
                  <code style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '4px 8px', 
                    borderRadius: '4px' 
                  }}>
                    /{category.slug}
                  </code>
                </Descriptions.Item>

                <Descriptions.Item label="Mô Tả">
                  {category.description ? (
                    <div style={{ 
                      whiteSpace: 'pre-wrap', 
                      wordBreak: 'break-word',
                      lineHeight: '1.6'
                    }}>
                      {category.description}
                    </div>
                  ) : (
                    <span style={{ color: '#999' }}>Chưa có mô tả</span>
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Thứ Tự Hiển Thị">
                  <span style={{ 
                    backgroundColor: '#e6f7ff', 
                    color: '#0050b3', 
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    #{category.sort_order || 0}
                  </span>
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                    (Nhỏ hơn → hiển thị trước)
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label="Trạng Thái">
                  <Space>
                    {category.is_active ? (
                      <Tag color="green" style={{ fontSize: '12px' }}>
                        ✓ Hoạt động
                      </Tag>
                    ) : (
                      <Tag color="red" style={{ fontSize: '12px' }}>
                        ✗ Không hoạt động
                      </Tag>
                    )}
                    {category.is_featured && (
                      <Tag color="gold" style={{ fontSize: '12px' }}>
                        ★ Nổi bật
                      </Tag>
                    )}
                  </Space>
                </Descriptions.Item>

                {category.parent_id && (
                  <Descriptions.Item label="Danh Mục Cha">
                    <Tag color="blue">ID: {category.parent_id}</Tag>
                  </Descriptions.Item>
                )}

                {category.created_at && (
                  <Descriptions.Item label="Tạo Lúc">
                    <Space>
                      <CalendarOutlined />
                      {new Date(category.created_at).toLocaleString('vi-VN')}
                    </Space>
                  </Descriptions.Item>
                )}

                {category.updated_at && (
                  <Descriptions.Item label="Cập Nhật Lúc">
                    <Space>
                      <CalendarOutlined />
                      {new Date(category.updated_at).toLocaleString('vi-VN')}
                    </Space>
                  </Descriptions.Item>
                )}
              </Descriptions>

              {/* Action Buttons */}
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              onClick={() => navigate('/admin?tab=categories')}>
                  Quay lại
                </Button>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => navigate(`/admin/categories/${id}`)}
                  icon={<EditOutlined />}
                >
                  Chỉnh Sửa Danh Mục
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CategoryDetail;
