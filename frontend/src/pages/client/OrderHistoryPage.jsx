import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Table, Tag, Button, Typography, Card, Modal, Descriptions } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { orderService } from '@/services/order.service';

const { Title } = Typography;

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                // Ensure data is an array
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => `#${text}`,
        },
        {
            title: 'Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Total',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => formatPrice(price),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'geekblue';
                if (status === 'COMPLETED') color = 'green';
                if (status === 'CANCELLED') color = 'red';
                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewOrder(record)}
                >
                    View
                </Button>
            ),
        },
    ];

    const modelColumns = [
        {
            title: 'Product',
            dataIndex: 'productName', // Accessing product name from nested object needs careful mapping below or transformation
            key: 'productName',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={record.product?.image} alt={record.product?.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }} />
                    <span>{record.product?.name}</span>
                </div>
            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatPrice(price),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Total',
            key: 'total',
            render: (_, record) => formatPrice(record.price * record.quantity),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Order History</Title>
            <Card>
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={`Order Details #${selectedOrder?.id}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
            >
                {selectedOrder && (
                    <div>
                        <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="Date">{new Date(selectedOrder.orderDate).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={selectedOrder.status === 'COMPLETED' ? 'green' : 'blue'}>
                                    {selectedOrder.status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Receiver">{selectedOrder.receiverName}</Descriptions.Item>
                            <Descriptions.Item label="Address">{selectedOrder.receiverAddress}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{selectedOrder.receiverPhone}</Descriptions.Item>
                            <Descriptions.Item label="Total Amount">
                                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    {formatPrice(selectedOrder.totalPrice)}
                                </span>
                            </Descriptions.Item>
                        </Descriptions>

                        <Table
                            columns={modelColumns}
                            dataSource={selectedOrder.orderDetails}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrderHistoryPage;
