import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../../lib/api';
import { Form, Input, Button, Card, Select, Row, Col, Spin, message, Switch } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { getProvinces, getDistrictsByProvince, getWardsByDistrict } from '../../../data/vietnamAddresses';

const AddressForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Load address if editing
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await API.get(`/addresses/${id}`);
        const addr = res?.data?.data || res?.data;
        if (addr) {
          form.setFieldsValue({
            fullName: addr.fullName,
            email: addr.email,
            phoneNumber: addr.phoneNumber,
            province_id: addr.province_id,
            district_id: addr.district_id,
            ward_id: addr.ward_id,
            street: addr.street,
            is_default: addr.is_default || false,
          });
          setSelectedProvince(addr.province_id);
          setSelectedDistrict(addr.district_id);
        }
      } catch (e) {
        console.error('Load address error:', e);
        message.error('Không tải được địa chỉ');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, form]);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedDistrict(null);
    form.setFieldValue('district_id', null);
    form.setFieldValue('ward_id', null);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    form.setFieldValue('ward_id', null);
  };

  const onFinish = async (values) => {
    setSaving(true);
    try {
      const toSend = {
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        province_id: values.province_id,
        district_id: values.district_id,
        ward_id: values.ward_id,
        street: values.street,
        is_default: values.is_default || false,
      };

      if (id) {
        await API.put(`/addresses/${id}`, toSend);
        message.success('Cập nhật địa chỉ thành công');
      } else {
        await API.post('/addresses', toSend);
        message.success('Thêm địa chỉ mới thành công');
      }

      navigate('/admin?tab=addresses');
    } catch (e) {
      console.error('Save error:', e);
      message.error(e.response?.data?.message || 'Lưu địa chỉ thất bại');
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
    <div style={{ padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <Card style={{ marginBottom: '24px' }}>
          <Row align="middle" justify="space-between">
            <Col>
              <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
                {id ? '✏️ Chỉnh Sửa Địa Chỉ' : '📍 Thêm Địa Chỉ Mới'}
              </h1>
            </Col>
            <Col>
              <Button
                onClick={() => navigate('/admin?tab=addresses')}
                icon={<ArrowLeftOutlined />}
              >
                Quay Lại
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Form */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Thông Tin Cá Nhân */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                👤 Thông Tin Cá Nhân
              </h3>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Tên Người Nhận"
                    name="fullName"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên người nhận' },
                      { min: 2, message: 'Tên phải ít nhất 2 ký tự' }
                    ]}
                  >
                    <Input placeholder="Nguyễn Văn A" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Số Điện Thoại"
                    name="phoneNumber"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại' },
                      { pattern: /^[0-9]{10,}$/, message: 'Số điện thoại không hợp lệ' }
                    ]}
                  >
                    <Input placeholder="0912345678" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input placeholder="email@example.com" size="large" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Địa Chỉ */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                🗺️ Địa Chỉ
              </h3>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Tỉnh/Thành Phố"
                    name="province_id"
                    rules={[
                      { required: true, message: 'Vui lòng chọn tỉnh/thành phố' }
                    ]}
                  >
                    <Select
                      placeholder="Chọn tỉnh/thành phố..."
                      options={getProvinces()}
                      onChange={handleProvinceChange}
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label="Quận/Huyện"
                    name="district_id"
                    rules={[
                      { required: true, message: 'Vui lòng chọn quận/huyện' }
                    ]}
                  >
                    <Select
                      placeholder="Chọn quận/huyện..."
                      options={getDistrictsByProvince(selectedProvince)}
                      onChange={handleDistrictChange}
                      disabled={!selectedProvince}
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label="Phường/Xã"
                    name="ward_id"
                    rules={[
                      { required: true, message: 'Vui lòng chọn phường/xã' }
                    ]}
                  >
                    <Select
                      placeholder="Chọn phường/xã..."
                      options={getWardsByDistrict(selectedProvince, selectedDistrict)}
                      disabled={!selectedDistrict}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    label="Số Nhà, Tên Đường"
                    name="street"
                    rules={[
                      { required: true, message: 'Vui lòng nhập địa chỉ chi tiết' },
                      { min: 5, message: 'Địa chỉ phải ít nhất 5 ký tự' }
                    ]}
                  >
                    <Input.TextArea
                      placeholder="VD: 123 Đường ABC, Tòa nhà XYZ"
                      rows={3}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Tùy Chọn */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                ⚙️ Tùy Chọn
              </h3>

              <Form.Item
                label="Đặt Làm Địa Chỉ Mặc Định"
                name="is_default"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </div>

            {/* Actions */}
            <Row justify="end" gutter={[12, 12]} style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
              <Col>
                <Button
                  size="large"
                  onClick={() => navigate('/admin?tab=addresses')}
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
                  {saving ? 'Đang lưu...' : 'Lưu Địa Chỉ'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddressForm;
