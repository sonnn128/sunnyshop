import React, { useEffect, useState } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Table, Tag, message, Spin } from 'antd';
import { useAuth } from '@/contexts/AuthContext.jsx';
import api from '@/config/api.js';

const { Title } = Typography;

const OrderPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const getStatusColor = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'completed': return 'green';
            case 'processing': return 'blue';
            case 'pending': return 'orange';
            default: return 'default';
        }
    };

    const loadOrders = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const resp = await api.get('/orders/my-orders');
            const data = resp.data.data || resp.data;
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load orders:', error);
            message.error('Unable to fetch orders. Showing local data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [user]);

    const columns = [
        {
            title: 'Order Number',
            dataIndex: 'id',
            key: 'orderNumber',
            render: (_, record) => record.orderNumber || record.id || record.code || ''
        },
        {
            title: 'Date',
            dataIndex: 'orderDate',
            key: 'date',
            render: (d) => d || record?.createdAt || ''
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {String(status || '').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Items',
            dataIndex: 'orderDetails',
            key: 'items',
            render: (orderDetails) => (Array.isArray(orderDetails) ? orderDetails.map(d => d.productName || d.name).join(', ') : '')
        },
        {
            title: 'Total',
            dataIndex: 'totalPrice',
            key: 'total',
            render: (t) => formatPrice(t),
        },
    ];

    if (!user) {
        return (
            <div>
                <Title level={2}>My Orders</Title>
                <Card>
                    <div>Please login to view your orders.</div>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <Title level={2}>My Orders</Title>
            <Card>
                {loading ? <Spin /> : (
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey={(r) => r.id}
                        pagination={{ pageSize: 10, showSizeChanger: true }}
                    />
                )}
            </Card>
        </div>
    );
};

export default OrderPage;
