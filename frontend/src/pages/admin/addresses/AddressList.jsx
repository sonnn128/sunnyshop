import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/lib/api';
import { Card, Button, Space, Table, Input, Popconfirm, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getProvinceName, getDistrictName, getWardName } from '@/data/vietnamAddresses';
import { useToast } from '@/components/ui/ToastProvider';

const AddressList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await API.get('/addresses');
      const addrs = res?.data?.data || res?.data?.addresses || res?.data || [];
      setAddresses(Array.isArray(addrs) ? addrs : []);
    } catch (e) {
      console.error('Load addresses error:', e);
      if (e.response?.status === 403) {
        toast.push({
          title: 'Không có quyền',
          message: 'Bạn không có quyền truy cập danh sách địa chỉ ở tài khoản hiện tại.',
          type: 'warning'
        });
      } else if (e.response?.status !== 404) {
        toast.push({
          title: 'Lỗi',
          message: 'Không tải được danh sách địa chỉ',
          type: 'error'
        });
      }
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/addresses/${id}`);
      toast.push({ title: 'Thành công', message: 'Xóa địa chỉ thành công', type: 'success' });
      fetchAddresses();
    } catch (e) {
      console.error('Delete error:', e);
      toast.push({
        title: 'Lỗi',
        message: e.response?.data?.message || 'Xóa địa chỉ thất bại',
        type: 'error'
      });
    }
  };

  const filteredAddresses = addresses.filter(addr => {
    const term = searchTerm.toLowerCase();
    return (
      addr.fullName?.toLowerCase().includes(term) ||
      addr.phoneNumber?.toLowerCase().includes(term) ||
      addr.street?.toLowerCase().includes(term) ||
      addr.email?.toLowerCase().includes(term)
    );
  });

  const columns = [
    {
      title: 'Tên Người Nhận',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => <strong>{text}</strong>,
      width: 150,
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 120,
    },
    {
      title: 'Địa Chỉ',
      key: 'address',
      render: (_, record) => (
        <div>
          <div>{record.street}</div>
          <small style={{ color: '#999' }}>
            {getWardName(record.province_id, record.district_id, record.ward_id)},
            {getDistrictName(record.province_id, record.district_id)},
            {getProvinceName(record.province_id)}
          </small>
        </div>
      ),
      width: 250,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 150,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'is_default',
      key: 'is_default',
      render: (is_default) => (
        <Tag color={is_default ? 'blue' : 'default'}>
          {is_default ? '★ Mặc Định' : 'Bình Thường'}
        </Tag>
      ),
      width: 120,
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/addresses/${record._id || record.id}`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa Địa Chỉ"
            description="Bạn chắc chắn muốn xóa địa chỉ này?"
            onConfirm={() => handleDelete(record._id || record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
          <Col>
            <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
              📍 Quản Lý Địa Chỉ
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#999' }}>
              Tổng cộng {addresses.length} địa chỉ
            </p>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/addresses/new')}
            >
              Thêm Địa Chỉ
            </Button>
          </Col>
        </Row>

        {/* Search */}
        <Card style={{ marginBottom: '24px' }}>
          <Input
            placeholder="Tìm kiếm theo tên, số điện thoại, địa chỉ..."
            prefix={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
        </Card>

        {/* Table */}
        <Card loading={loading}>
          {filteredAddresses.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '16px', color: '#999' }}>Chưa có địa chỉ nào</p>
              <Button
                type="primary"
                size="large"
                style={{ marginTop: '16px' }}
                onClick={() => navigate('/admin/addresses/new')}
              >
                <PlusOutlined /> Thêm Địa Chỉ Đầu Tiên
              </Button>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredAddresses}
              rowKey={(record) => record._id || record.id}
              pagination={{
                pageSize,
                total: filteredAddresses.length,
                onChange: (page, newPageSize) => setPageSize(newPageSize),
              }}
              scroll={{ x: '100%' }}
              loading={loading}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AddressList;
