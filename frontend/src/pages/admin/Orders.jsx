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
      message.success('Order status updated successfully');
      fetchOrders(pagination.current - 1, pagination.pageSize, statusFilter);
    } catch (error) {
      console.error('Failed to update order status:', error);
      message.error('Failed to update order status');
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
      case 'PENDING': return <Badge status="warning" text="Pending" />;
      case 'PROCESSING': return <Badge status="processing" text="Processing" />;
      case 'COMPLETED': return <Badge status="success" text="Completed" />;
      case 'CANCELLED': return <Badge status="error" text="Cancelled" />;
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
      title: 'Order Number',
      key: 'orderNumber',
      render: (_, record) => getOrderNumber(record),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div>{getCustomerName(record)}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{getCustomerEmail(record)}</div>
        </div>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (_, record) => {
        const amount = getTotalAmount(record);
        return amount ? formatPrice(amount) : formatPrice(0);
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusBadge(status),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (_, record) => getOrderDate(record),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleStatusChange(record.id, 'PROCESSING')}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Process
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => handleStatusChange(record.id, 'CANCELLED')}
              >
                Cancel
              </Button>
            </>
          )}
          {record.status === 'PROCESSING' && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleStatusChange(record.id, 'COMPLETED')}
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
            >
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <Title level={2} style={{ margin: 0 }}>Orders Management</Title>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            style={{ width: 150 }}
            placeholder="Filter by status"
          >
            <Option value="ALL">All Orders</Option>
            <Option value="PENDING">Pending</Option>
            <Option value="PROCESSING">Processing</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
          }}
        />
      </Card>

      <Modal
        title={`Order Details - ${getOrderNumber(selectedOrder)}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={1} size="middle" styles={{ label: { width: '150px' } }}>
              <Descriptions.Item label="Date">
                {getOrderDate(selectedOrder)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusBadge(selectedOrder.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Receiver">
                {selectedOrder.receiverName || getCustomerName(selectedOrder)}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {selectedOrder.receiverAddress || selectedOrder.shippingAddress || ''}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedOrder.receiverPhone || ''}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <Typography.Text strong style={{ fontSize: '16px' }}>
                  {formatPrice(getTotalAmount(selectedOrder))}
                </Typography.Text>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <Table
                dataSource={getItems(selectedOrder)}
                columns={[
                  {
                    title: 'Product',
                    key: 'product',
                    width: '40%',
                    render: (_, record) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Image
                          src={record.product?.image}
                          width={50}
                          height={50}
                          style={{ objectFit: 'cover', borderRadius: '4px' }}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsZqBg+IkQAi4eNcY2FQ+gfQO8nX3GwQcbgx1j+BmFUpA4nXwDxKzToYG4ib/2//9nYGBgO8T8//9+4///v4sB3d9vGjD8HwD3FgLefG8sYgAAAAlwSFlzAAALEgAACxIB0t1+/AAAADh0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAADUlEQVQ4jWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="
                        />
                        <span>{record.product?.name || 'Unknown Product'}</span>
                      </div>
                    )
                  },
                  {
                    title: 'Price',
                    dataIndex: 'price',
                    key: 'price',
                    render: (price) => formatPrice(price || 0)
                  },
                  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                  {
                    title: 'Total',
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
