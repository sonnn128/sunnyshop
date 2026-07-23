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
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'orderNumber',
            render: (_, record) => record.orderNumber || record.id || record.code || ''
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'orderDate',
            key: 'date',
            render: (d) => d || record?.createdAt || ''
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {String(status || '').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'orderDetails',
            key: 'items',
            render: (orderDetails) => (Array.isArray(orderDetails) 
                ? orderDetails.map(d => {
                    const name = d.product?.name || d.productName || d.name || '';
                    const attrs = [d.size, d.color].filter(Boolean).join('/');
                    return name + (attrs ? ` (${attrs})` : '');
                }).join(', ') 
                : '')
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'total',
            render: (t) => formatPrice(t),
        },
    ];

    if (!user) {
        return (
            <div>
                <Title level={2}>Đơn hàng của tôi</Title>
                <Card>
                    <div>Vui lòng đăng nhập để xem đơn hàng của bạn.</div>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <Title level={2}>Đơn hàng của tôi</Title>
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
