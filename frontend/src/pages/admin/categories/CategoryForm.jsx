import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '@/lib/api';
import { Form, Input, Button, Card, Space, Row, Col, InputNumber, message, Image as AntImage, Spin } from 'antd';
import { FolderOutlined, ArrowLeftOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';

const CategoryForm = ({ embedded = false, onSuccess, onCancel, entityId }) => {
  const { id: routeId } = useParams();
  const id = entityId || routeId;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Load category if editing
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    (async () => {
      try {
        const res = await API.get(`/categories/${id}`);
        const cat = res?.data?.data || res?.data?.category || res?.data;
        if (cat) {
          form.setFieldsValue({
            name: cat.name || '',
            slug: cat.slug || '',
            description: cat.description || '',
            sort_order: cat.sort_order || 0,
          });
          setImageUrl(cat.image_url || cat.imageUrl || '');
        }
      } catch (e) {
        console.error('Load category error:', e);
        message.error('Không tải được danh mục');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, form]);

  const generateSlug = async () => {
    const name = form.getFieldValue('name');
    if (!name?.trim()) {
      message.warning('Vui lòng nhập tên danh mục trước');
      return;
    }
    
    try {
      const params = new URLSearchParams({
        name: name,
        ...(id && { excludeId: id })
      });
      
      const res = await API.get(`/categories/generate-slug?${params}`);
      const newSlug = res?.data?.data?.slug || res?.data?.slug;
      
      if (newSlug) {
        form.setFieldValue('slug', newSlug);
        message.success('Slug được tạo tự động thành công');
      }
    } catch (e) {
      console.error('Generate slug error:', e);
      const fallbackSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      form.setFieldValue('slug', fallbackSlug);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  const onFinish = async (values) => {
    setSaving(true);
    
    try {
      const toSend = {
        name: values.name?.trim() || '',
        slug: values.slug?.trim() || '',
        description: values.description?.trim() || '',
        image_url: imageUrl?.trim() || '',
        sort_order: values.sort_order || 0,
      };

      if (id) {
        await API.put(`/api/categories/${id}`, toSend);
        message.success('Cập nhật danh mục thành công');
      } else {
        await API.post('/api/categories', toSend);
        message.success('Tạo danh mục mới thành công');
      }

      if (embedded) {
        onSuccess?.();
      } else {
        navigate('/admin?tab=categories');
      }
    } catch (e) {
      console.error('Save error:', e);
      const errorMessage = e.response?.data?.message || 'Lưu danh mục thất bại';
      
      // If slug already exists, auto-generate a new one and retry
      if (errorMessage.includes('Slug already exists') || errorMessage.includes('slug')) {
        message.loading('Slug đã tồn tại, tự động tạo slug mới...');
        
        try {
          const name = form.getFieldValue('name');
          const params = new URLSearchParams({
            name: name,
            ...(id && { excludeId: id })
          });
          
          const res = await API.get(`/categories/generate-slug?${params}`);
          const newSlug = res?.data?.data?.slug || res?.data?.slug;
          
          if (newSlug && newSlug !== values.slug) {
            const retryToSend = {
              ...values,
              name: values.name?.trim() || '',
              slug: newSlug,
              description: values.description?.trim() || '',
              image_url: imageUrl,
              sort_order: values.sort_order || 0,
            };
            
            if (id) {
              await API.put(`/api/categories/${id}`, retryToSend);
            } else {
              await API.post('/api/categories', retryToSend);
            }
            
            message.success(`Slug đã tồn tại. Hệ thống đã tự động tạo slug mới: ${newSlug}`);
            if (embedded) {
              onSuccess?.();
            } else {
              navigate('/admin?tab=categories');
            }
            return;
          }
        } catch (retryErr) {
          console.error('Auto-generate slug and retry failed:', retryErr);
          message.error('Không thể tạo slug tự động. Vui lòng thử slug khác.');
        }
      } else {
        message.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: embedded ? '0' : '24px' }}>
      <div style={{ maxWidth: embedded ? '100%' : '900px', margin: '0 auto' }}>
        {/* Header Card */}
        {!embedded && (
        <Card 
          style={{ marginBottom: '24px' }}
          title={
            <Space>
              <FolderOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {id ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục Mới'}
              </span>
            </Space>
          }
          extra={id && (
            <div style={{ textAlign: 'right', fontSize: '12px' }}>
              <div style={{ color: '#999' }}>Đang chỉnh sửa</div>
              <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
                {form.getFieldValue('name') || 'Chưa có tên'}
              </div>
            </div>
          )}
        >
          <p style={{ margin: 0, color: '#666' }}>
            {id ? 'Cập nhật thông tin danh mục hiện có' : 'Tạo một danh mục mới cho sản phẩm'}
          </p>
        </Card>
        )}

        {/* Form */}
        <Card
          bordered={!embedded}
          style={embedded ? { border: 'none', boxShadow: 'none', background: 'transparent' } : undefined}
          bodyStyle={embedded ? { padding: 0 } : undefined}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Thông Tin Cơ Bản */}
            <div style={{ marginBottom: embedded ? '16px' : '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                📋 Thông Tin Cơ Bản
              </h3>
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Tên Danh Mục"
                    name="name"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên danh mục' },
                      { min: 2, message: 'Tên phải ít nhất 2 ký tự' }
                    ]}
                  >
                    <Input placeholder="VD: Áo nam" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={10}>
                  <Form.Item
                    label="Slug (URL)"
                    name="slug"
                    rules={[
                      { required: true, message: 'Vui lòng nhập slug' }
                    ]}
                  >
                    <Input placeholder="ao-nam" size="large" />
                  </Form.Item>
                  <Button 
                    type="link" 
                    onClick={generateSlug}
                    style={{ fontSize: '12px', padding: '0', marginTop: '4px' }}
                  >
                    ↻ Tạo tự động
                  </Button>
                </Col>
                <Col xs={24} sm={24} md={6}>
                  <Form.Item
                    label="Thứ Tự"
                    name="sort_order"
                    initialValue={0}
                    rules={[
                      { type: 'number', message: 'Phải là số' }
                    ]}
                  >
                    <InputNumber min={0} size="large" style={{ width: '100%' }} />
                  </Form.Item>
                  <div style={{ fontSize: '11px', color: '#999' }}>Nhỏ hơn → hiển thị trước</div>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    label="Mô Tả"
                    name="description"
                  >
                    <Input.TextArea 
                      placeholder="Mô tả chi tiết về danh mục..." 
                      rows={4}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Hình Ảnh */}
            <div style={{ marginBottom: embedded ? '12px' : '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                🖼️ Hình Ảnh
              </h3>

              {/* Image Preview */}
              {imageUrl && (
                <div style={{ marginBottom: '16px' }}>
                  <AntImage
                    width={120}
                    height={120}
                    src={imageUrl}
                    alt={form.getFieldValue('name')}
                    preview
                    style={{ borderRadius: '8px', border: '1px solid #d9d9d9' }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <Button 
                      type="primary" 
                      danger 
                      size="small" 
                      onClick={handleRemoveImage}
                      icon={<DeleteOutlined />}
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                </div>
              )}

              <Form.Item label="URL Ảnh">
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  size="large"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </Form.Item>
            </div>

            {/* Actions */}
            <Row justify="end" gutter={[12, 12]} style={{ marginTop: embedded ? '16px' : '32px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
              {!embedded && (
                <Col>
                  <Button 
                    size="large"
                    onClick={() => {
                      if (embedded) {
                        onCancel?.();
                      } else {
                        navigate('/admin?tab=categories');
                      }
                    }}
                  >
                    <ArrowLeftOutlined /> Hủy
                  </Button>
                </Col>
              )}
              <Col>
                <Button 
                  type="primary" 
                  size="large"
                  htmlType="submit"
                  loading={saving}
                  icon={<SaveOutlined />}
                >
                  {saving ? 'Đang lưu...' : 'Lưu Danh Mục'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CategoryForm;
