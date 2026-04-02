import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import {
  Table,
  Button,
  Space,
  Modal,
  Select,
  message,
  Typography,
  Card,
  Tag,
  Descriptions,
  Badge,
  Image
} from 'antd';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { orderService } from '../../services/order.service';

const { Title } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Mock data
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (page = 0, size = 10, status = 'ALL') => {
    setLoading(true);
    try {
      let response;
      if (status === 'ALL') {
        response = await orderService.getAll({ page, size });
      } else {
        response = await orderService.getByStatus(status, { page, size });
      }

      console.log('Orders API response:', response);

      // Handle Page object response
      if (response && response.content) {
        // It's a Page object
        console.log('Page content:', response.content);
        setOrders(Array.isArray(response.content) ? response.content : []);
        setPagination(prev => ({
          ...prev,
          current: page + 1,
          total: response.totalElements || 0
        }));
      } else if (Array.isArray(response)) {
        // It's a direct array
        console.log('Direct array:', response);
        setOrders(response);
        setPagination(prev => ({
          ...prev,
          current: page + 1,
          total: response.length
        }));
      } else {
        console.log('No data found');
        setOrders([]);
        setPagination(prev => ({
          ...prev,
          current: page + 1,
          total: 0
        }));
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      message.error('Failed to fetch orders from API');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    setSelectedOrder(record);
    setModalVisible(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      message.success('Cập nhật trạng thái đơn hàng thành công');
      fetchOrders(pagination.current - 1, pagination.pageSize, statusFilter);
    } catch (error) {
      console.error('Failed to update order status:', error);
      message.error('Cập nhật trạng thái đơn hàng thất bại');
    }
  };

  const handleTableChange = (pagination) => {
    fetchOrders(pagination.current - 1, pagination.pageSize, statusFilter);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    fetchOrders(0, pagination.pageSize, value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <Badge status="warning" text="Chờ xử lý" />;
      case 'PROCESSING': return <Badge status="processing" text="Đang xử lý" />;
      case 'COMPLETED': return <Badge status="success" text="Hoàn thành" />;
      case 'CANCELLED': return <Badge status="error" text="Đã hủy" />;
      default: return <Badge status="default" text={status} />;
    }
  };

  // Flexible getters to handle different API response shapes
  const getOrderNumber = (record) => {
    if (!record) return '';
    return record.orderNumber || record.orderNo || record.code || record.id || '';
  };

  const getCustomerName = (record) => {
    if (!record) return '';
    if (record.receiverName) return record.receiverName; // Priority check
    // common shapes
    if (record.customerName) return record.customerName;
    if (record.customer && (record.customer.name || record.customer.fullName)) return record.customer.name || record.customer.fullName;
    if (record.user && (record.user.fullName || record.user.username)) return record.user.fullName || record.user.username;
    if (record.customer && record.customer.user && (record.customer.user.fullName || record.customer.user.username)) return record.customer.user.fullName || record.customer.user.username;
    return record.customer?.name || record.customer?.username || '';
  };

  const getCustomerEmail = (record) => {
    if (!record) return '';
    if (record.customerEmail) return record.customerEmail;
    if (record.customer && record.customer.email) return record.customer.email;
    if (record.user && record.user.email) return record.user.email;
    if (record.customer && record.customer.user && record.customer.user.email) return record.customer.user.email;
    return '';
  };

  const getTotalAmount = (record) => {
    if (record == null) return 0;
    return record.totalAmount ?? record.totalPrice ?? record.total ?? record.amount ?? 0;
  };

  const getOrderDate = (record) => {
    if (!record) return '';
    return record.orderDate || record.createdAt || record.createdDate || record.date || '';
  };

  const getItems = (record) => {
    if (!record) return [];
    return record.orderDetails || record.items || record.orderItems || record.details || [];
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      key: 'orderNumber',
      render: (_, record) => <Typography.Text strong style={{ color: '#111827' }}>#{getOrderNumber(record)}</Typography.Text>,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, color: '#111827' }}>{getCustomerName(record)}</div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>{getCustomerEmail(record)}</div>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (_, record) => {
        const amount = getTotalAmount(record);
        return <Typography.Text strong>{amount ? formatPrice(amount) : formatPrice(0)}</Typography.Text>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusBadge(status),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (_, record) => {
         const date = getOrderDate(record);
         return date ? new Date(date).toLocaleString('vi-VN') : '';
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            style={{ borderRadius: '8px' }}
          >
            Xem
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleStatusChange(record.id, 'PROCESSING')}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', borderRadius: '8px' }}
              >
                Xử lý
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => handleStatusChange(record.id, 'CANCELLED')}
                style={{ borderRadius: '8px' }}
              >
                Hủy
              </Button>
            </>
          )}
          {record.status === 'PROCESSING' && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleStatusChange(record.id, 'COMPLETED')}
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', borderRadius: '8px' }}
            >
              Hoàn thành
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} bodyStyle={{ padding: 0 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#111827' }}>Quản lý đơn hàng</Title>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            style={{ width: 180 }}
            placeholder="Lọc theo trạng thái"
            size="large"
          >
            <Option value="ALL">Tất cả đơn hàng</Option>
            <Option value="PENDING">Chờ xử lý</Option>
            <Option value="PROCESSING">Đang xử lý</Option>
            <Option value="COMPLETED">Hoàn thành</Option>
            <Option value="CANCELLED">Đã hủy</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
          className="premium-table"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
            style: { padding: '0 24px 24px 24px' }
          }}
        />
      </Card>

      <Modal
        title={<span style={{ fontWeight: 700 }}>Chi tiết đơn hàng - #{getOrderNumber(selectedOrder)}</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        styles={{
          header: {
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16
          }
        }}
      >
        {selectedOrder && (
          <div style={{ marginTop: 16 }}>
            <Descriptions bordered column={1} size="middle" styles={{ label: { width: '150px', fontWeight: 500 } }}>
              <Descriptions.Item label="Ngày đặt">
                {getOrderDate(selectedOrder) ? new Date(getOrderDate(selectedOrder)).toLocaleString('vi-VN') : ''}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusBadge(selectedOrder.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Người nhận">
                {selectedOrder.receiverName || getCustomerName(selectedOrder)}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {selectedOrder.receiverAddress || selectedOrder.shippingAddress || ''}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.receiverPhone || ''}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Typography.Text strong style={{ fontSize: '16px', color: '#EF4444' }}>
                  {formatPrice(getTotalAmount(selectedOrder))}
                </Typography.Text>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <Title level={5} style={{ marginBottom: 16, color: '#111827' }}>Sản phẩm đã đặt</Title>
              <Table
                dataSource={getItems(selectedOrder)}
                className="premium-table"
                columns={[
                  {
                    title: 'Sản phẩm',
                    key: 'product',
                    width: '40%',
                    render: (_, record) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Image
                          src={record.product?.image}
                          width={50}
                          height={50}
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsZqBg+IkQAi4eNcY2FQ+gfQO8nX3GwQcbgx1j+BmFUpA4nXwDxKzToYG4ib/2//9nYGBgO8T8//9+4///v4sB3d9vGjD8HwD3FgLefG8sYgAAAAlwSFlzAAALEgAACxIB0t1+/AAAADh0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAADUlEQVQ4jWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="
                        />
                        <span style={{ fontWeight: 500, color: '#111827' }}>{record.product?.name || 'Sản phẩm không xác định'}</span>
                      </div>
                    )
                  },
                  {
                    title: 'Giá',
                    dataIndex: 'price',
                    key: 'price',
                    render: (price) => formatPrice(price || 0)
                  },
                  { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
                  {
                    title: 'Thành tiền',
                    key: 'total',
                    render: (_, record) => (
                      <Typography.Text strong>
                        {formatPrice((record.price || 0) * (record.quantity || 0))}
                      </Typography.Text>
                    )
                  },
                ]}
                pagination={false}
                rowKey="id"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
