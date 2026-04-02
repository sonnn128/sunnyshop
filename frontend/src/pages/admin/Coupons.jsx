import React, { useState, useEffect } from 'react';
import { Table, Space, Typography, Card, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Row, Col, DatePicker, Switch, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined } from '@ant-design/icons';
import { couponService } from '../../services/coupon.service';
import { formatPrice } from '@/utils/format';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form] = Form.useForm();
  
  // For dynamic form fields (PERCENTAGE vs FIXED)
  const [discountType, setDiscountType] = useState('PERCENTAGE');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponService.getAll();
      setCoupons(data || []);
    } catch (error) {
      console.error('Failed to fetch coupons', error);
      message.error('Tải mã giảm giá thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCoupon(null);
    setDiscountType('PERCENTAGE');
    form.resetFields();
    // Default values
    form.setFieldsValue({
      isActive: true,
      discountType: 'PERCENTAGE',
      usageLimit: 100
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCoupon(record);
    setDiscountType(record.discountType);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await couponService.delete(id);
      message.success('Xóa mã giảm giá thành công');
      fetchCoupons();
    } catch (error) {
      console.error(error);
      message.error('Xóa thất bại');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD HH:mm:ss') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD HH:mm:ss') : null,
      };

      if (editingCoupon) {
        await couponService.update(editingCoupon.id, payload);
        message.success('Cập nhật mã giảm giá thành công');
      } else {
        await couponService.create(payload);
        message.success('Tạo mã giảm giá thành công');
      }
      setModalVisible(false);
      fetchCoupons();
    } catch (error) {
      console.error('Failed to save coupon', error);
      message.error('Lưu mã giảm giá thất bại');
    }
  };

  const columns = [
    {
      title: 'Mã (Code)',
      dataIndex: 'code',
      key: 'code',
      render: text => <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px', fontWeight: 700 }}>{text}</Tag>
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      render: (_, record) => {
        if (record.discountType === 'PERCENTAGE') {
          return <Text strong type="danger">{record.discountValue}%</Text>;
        }
        return <Text strong type="danger">{formatPrice(record.discountValue)}</Text>;
      }
    },
    {
      title: 'Đơn tối thiểu',
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
      render: val => val ? formatPrice(val) : 'Không có'
    },
    {
      title: 'Giảm tối đa',
      dataIndex: 'maxDiscountAmount',
      key: 'maxDiscountAmount',
      render: (val, record) => record.discountType === 'PERCENTAGE' && val ? formatPrice(val) : '-'
    },
    {
      title: 'Đã dùng / Giới hạn',
      key: 'usage',
      render: (_, record) => (
        <span>
          <Text type="success" strong>{record.usedCount || 0}</Text> / {record.usageLimit || '∞'}
        </span>
      )
    },
    {
      title: 'Hạn dùng',
      key: 'validity',
      render: (_, record) => (
        <div style={{ fontSize: '13px' }}>
          <div>Từ: {record.startDate ? dayjs(record.startDate).format('DD/MM/YYYY HH:mm') : 'Bây giờ'}</div>
          <div>Đến: {record.endDate ? dayjs(record.endDate).format('DD/MM/YYYY HH:mm') : 'Không giới hạn'}</div>
        </div>
      )
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      render: val => val ? <Tag color="success">Bật</Tag> : <Tag color="error">Tắt</Tag>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ borderRadius: '6px' }}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa mã này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
              style={{ borderRadius: '6px' }}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GiftOutlined style={{ color: '#4F46E5' }} /> Quản lý Voucher / Mã giảm giá
              </Title>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                style={{ backgroundColor: '#4F46E5', borderRadius: '8px', height: '40px', fontWeight: 600 }}
              >
                Tạo mã mới
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={coupons}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, style: { padding: '0 24px 24px' } }}
        />
      </Card>

      <Modal
        title={<span style={{ fontWeight: 700 }}>{editingCoupon ? 'Cập nhật Mã giảm giá' : 'Tạo mới Mã giảm giá'}</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="code" label={<span style={{ fontWeight: 500 }}>Mã Coupon (VD: NAMSALE20)</span>} rules={[{ required: true, message: 'Nhập mã!' }]}>
                <Input size="large" style={{ borderRadius: '8px', textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="discountType" label={<span style={{ fontWeight: 500 }}>Loại giảm</span>} rules={[{ required: true }]}>
                <Select size="large" onChange={val => setDiscountType(val)}>
                  <Option value="PERCENTAGE">Giảm theo %</Option>
                  <Option value="FIXED">Giảm số tiền cố định</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="discountValue"
                label={<span style={{ fontWeight: 500 }}>Mức giảm {discountType === 'PERCENTAGE' ? '(%)' : '(VNĐ)'}</span>}
                rules={[{ required: true, message: 'Nhập mức giảm!' }]}
              >
                <InputNumber 
                  size="large" 
                  style={{ width: '100%', borderRadius: '8px' }} 
                  min={1} 
                  max={discountType === 'PERCENTAGE' ? 100 : 999999999} 
                  formatter={value => discountType !== 'PERCENTAGE' ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : value}
                  parser={value => discountType !== 'PERCENTAGE' ? value.replace(/\./g, '') : value}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="usageLimit" label={<span style={{ fontWeight: 500 }}>Giới hạn lượt dùng</span>}>
                <InputNumber size="large" style={{ width: '100%', borderRadius: '8px' }} min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minOrderValue" label={<span style={{ fontWeight: 500 }}>Giá trị đơn tối thiểu (VNĐ)</span>}>
                <InputNumber 
                  size="large" 
                  style={{ width: '100%', borderRadius: '8px' }} 
                  min={0} 
                  step={10000} 
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  parser={value => value.replace(/\./g, '')}
                />
              </Form.Item>
            </Col>
            {discountType === 'PERCENTAGE' && (
              <Col span={12}>
                <Form.Item name="maxDiscountAmount" label={<span style={{ fontWeight: 500 }}>Giảm tối đa (VNĐ)</span>}>
                  <InputNumber 
                    size="large" 
                    style={{ width: '100%', borderRadius: '8px' }} 
                    min={0} 
                    step={10000} 
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={value => value.replace(/\./g, '')}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startDate" label={<span style={{ fontWeight: 500 }}>Thời gian bắt đầu</span>}>
                <DatePicker showTime size="large" style={{ width: '100%', borderRadius: '8px' }} format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label={<span style={{ fontWeight: 500 }}>Thời gian kết thúc</span>}>
                <DatePicker showTime size="large" style={{ width: '100%', borderRadius: '8px' }} format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="isActive" label={<span style={{ fontWeight: 500 }}>Trạng thái hoạt động</span>} valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)} size="large" style={{ borderRadius: '8px' }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" size="large" style={{ backgroundColor: '#4F46E5', borderRadius: '8px' }}>
                {editingCoupon ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Coupons;
