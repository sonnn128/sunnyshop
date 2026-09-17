import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Table, Tag, Button, Typography, Card, Modal, Descriptions, Row, Col, Statistic } from 'antd';
import { EyeOutlined, ShoppingCartOutlined, ShoppingOutlined, DollarOutlined } from '@ant-design/icons';
import { orderService } from '@/services/order.service';

const { Title } = Typography;

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState({
        totalOrders: 0,
        totalProductsPurchased: 0,
        totalSpent: 0
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const [ordersData, statisticsData] = await Promise.all([
                    orderService.getMyOrders(),
                    orderService.getMyOrderStatistics()
                ]);
                // Ensure data is an array
                setOrders(Array.isArray(ordersData) ? ordersData : []);
                setStatistics({
                    totalOrders: statisticsData?.totalOrders || 0,
                    totalProductsPurchased: statisticsData?.totalProductsPurchased || 0,
                    totalSpent: statisticsData?.totalSpent || 0
                });
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
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
            render: (text) => `#${text}`,
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => formatPrice(price),
        },
        {
            title: 'Trạng thái',
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
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewOrder(record)}
                >
                    Xem
                </Button>
            ),
        },
    ];

    const modelColumns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={record.product?.image} alt={record.product?.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                        <div style={{ fontWeight: 500 }}>{record.product?.name}</div>
                        {(record.size || record.color) && (
                            <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                                {record.size && <span style={{ fontSize: '10px', padding: '1px 6px', backgroundColor: '#F3F4F6', borderRadius: '4px', color: '#4B5563', fontWeight: 500 }}>Size: {record.size}</span>}
                                {record.color && <span style={{ fontSize: '10px', padding: '1px 6px', backgroundColor: '#F3F4F6', borderRadius: '4px', color: '#4B5563', fontWeight: 500 }}>Màu: {record.color}</span>}
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatPrice(price),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (_, record) => formatPrice(record.price * record.quantity),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Lịch sử đơn hàng</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic title="Tổng đơn hàng" value={statistics.totalOrders} prefix={<ShoppingCartOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic title="Sản phẩm đã mua" value={statistics.totalProductsPurchased} prefix={<ShoppingOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic title="Tổng tiền đã mua" value={statistics.totalSpent} prefix={<DollarOutlined />} formatter={(value) => formatPrice(value)} />
                    </Card>
                </Col>
            </Row>
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
                title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
            >
                {selectedOrder && (
                    <div>
                        <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="Ngày đặt">{new Date(selectedOrder.orderDate).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={selectedOrder.status === 'COMPLETED' ? 'green' : 'blue'}>
                                    {selectedOrder.status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Người nhận">{selectedOrder.receiverName}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">{selectedOrder.receiverAddress}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{selectedOrder.receiverPhone}</Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền">
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
