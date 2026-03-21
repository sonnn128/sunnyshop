import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../../lib/api';
import { uploadImage } from '../../../lib/uploadApi';
import { Form, Input, Button, Card, Space, Row, Col, InputNumber, message, Upload, Image as AntImage, Spin } from 'antd';
import { FolderOutlined, PictureOutlined, ArrowLeftOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [localImageFile, setLocalImageFile] = useState(null);
  const [localImagePreview, setLocalImagePreview] = useState('');
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

  const handleImageUpload = async (info) => {
    const file = info.file;
    if (!file.type.startsWith('image/')) {
      message.error('Chỉ chấp nhận file ảnh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error('File quá lớn (max 5MB)');
      return;
    }

    setLocalImageFile(file);
    setLocalImagePreview(URL.createObjectURL(file));
    message.info('Ảnh sẽ được upload khi bấm "Lưu danh mục"');
  };

  const handleRemoveImage = () => {
    if (localImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(localImagePreview);
    }
    setLocalImageFile(null);
    setLocalImagePreview('');
    setImageUrl('');
  };

  const onFinish = async (values) => {
    setSaving(true);
    
    try {
      let imageUrlToSave = imageUrl;

      // Upload image if there's a new file
      if (localImageFile) {
        setUploadingImage(true);
        const uploadedUrl = await uploadImage(localImageFile);
        if (!uploadedUrl) {
          throw new Error('Không nhận được URL ảnh từ server');
        }
        imageUrlToSave = uploadedUrl;
      }

      const toSend = {
        name: values.name?.trim() || '',
        slug: values.slug?.trim() || '',
        description: values.description?.trim() || '',
        image_url: imageUrlToSave,
        sort_order: values.sort_order || 0,
      };

      if (id) {
        await API.put(`/api/categories/${id}`, toSend);
        message.success('Cập nhật danh mục thành công');
      } else {
        await API.post('/api/categories', toSend);
        message.success('Tạo danh mục mới thành công');
      }
      
      navigate('/admin?tab=categories');
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
            navigate('/admin?tab=categories');
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
      setUploadingImage(false);
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
    <div style={{ padding: '24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header Card */}
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

        {/* Form */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Thông Tin Cơ Bản */}
            <div style={{ marginBottom: '24px' }}>
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
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                🖼️ Hình Ảnh
              </h3>

              {/* Image Preview */}
              {(localImagePreview || imageUrl) && (
                <div style={{ marginBottom: '16px' }}>
                  <AntImage
                    width={120}
                    height={120}
                    src={localImagePreview || imageUrl}
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

              {/* Upload */}
              <Form.Item label="Tải Ảnh Lên">
                <Upload
                  beforeUpload={handleImageUpload}
                  maxCount={1}
                  accept="image/*"
                  listType="picture"
                >
                  <Button 
                    type="dashed" 
                    size="large" 
                    style={{ width: '100%' }}
                    icon={<PictureOutlined />}
                  >
                    Click để chọn ảnh
                  </Button>
                </Upload>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                  PNG, JPG, GIF (Max 5MB) • Upload khi bấm "Lưu danh mục"
                </div>
              </Form.Item>

              {/* Or URL */}
              <Form.Item
                label="Hoặc Nhập URL Ảnh"
              >
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  size="large"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </Form.Item>
            </div>

            {/* Actions */}
            <Row justify="end" gutter={[12, 12]} style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
              <Col>
                <Button 
                  size="large"
                  onClick={() => navigate('/admin?tab=categories')}
                >
                  <ArrowLeftOutlined /> Hủy
                </Button>
              </Col>
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
