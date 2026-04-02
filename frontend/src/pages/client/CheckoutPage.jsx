import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Form, Input, Button, Row, Col, Table, message, Spin, Empty, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import api from '@/config/api.js';

const { Title, Text } = Typography;

const CheckoutPage = () => {
    const { token } = theme.useToken();
    const { cartItems, totalPrice, clearCart, removeFromCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (cartItems.length === 0) {
            message.warning('Your cart is empty');
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const onFinish = async (values) => {
        console.log('Form values:', values);
        console.log('Cart items:', cartItems);

        if (cartItems.length === 0) {
            message.error('Your cart is empty');
            return;
        }

        let orderData = null;
        try {
            setLoading(true);

            orderData = {
                receiverName: `${values.firstName} ${values.lastName}`.trim(),
                receiverAddress: `${values.address}, ${values.city}, ${values.state} ${values.zipCode}`.trim(),
                receiverPhone: values.phone || 'N/A',
                cartItems: cartItems.map(item => ({
                    productId: parseInt(item.id),
                    quantity: parseInt(item.quantity)
                }))
            };

            console.log('Sending order data:', orderData);

            const response = await api.post('/orders', orderData);

            console.log('Order response status:', response.status);
            console.log('Order response data:', response.data);

            if (response.status === 201 && response.data) {
                message.success('Order placed successfully!');
                await clearCart();
                navigate('/orders');
            } else {
                message.error('Order created but unexpected response received');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Order data sent:', orderData);

            const serverMessage = error.response?.data?.message || error.response?.data?.error;

            // Special-case: insufficient product quantity -> remove offending item from cart
            if (serverMessage && serverMessage.startsWith('Insufficient product quantity for product:')) {
                const productName = serverMessage.replace('Insufficient product quantity for product:', '').trim();
                // find item in local cart by name
                const offending = cartItems.find(i => i.name === productName || String(i.id) === productName);
                if (offending) {
                    try {
                        await removeFromCart(offending.id);
                        message.error(`${productName} is out of stock and was removed from your cart. Please review your cart and try again.`);
                    } catch (e) {
                        console.error('Failed to remove out-of-stock item from cart:', e);
                        message.error(serverMessage || 'Some items are out of stock. Please review your cart.');
                    }
                } else {
                    // Couldn't find matching item locally, just show the server message
                    message.error(serverMessage);
                }
            } else {
                const errorMessage = serverMessage || 'Failed to place order. Please try again.';
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                        src={record.image || 'https://via.placeholder.com/40x40?text=No+Image'}
                        alt={text}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                        {record.factory && (
                            <div style={{ color: '#666', fontSize: '12px' }}>by {record.factory}</div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatPrice(price),
            width: 100,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80,
        },
        {
            title: 'Total',
            key: 'total',
            render: (_, record) => formatPrice(record.price * record.quantity),
            width: 100,
        },
    ];

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Empty description="Your cart is empty" />
                <Button type="primary" onClick={() => navigate('/products')}>
                    Continue Shopping
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Title level={2}>Checkout</Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title="Shipping Information">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{
                                firstName: user?.fullName?.split(' ')[0] || '',
                                lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
                                phone: user?.phone || '',
                                address: user?.address || '',
                            }}
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="firstName"
                                        label="First Name"
                                        rules={[{ required: true, message: 'Please input your first name!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="lastName"
                                        label="Last Name"
                                        rules={[{ required: true, message: 'Please input your last name!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="phone"
                                label="Phone Number"
                                rules={[
                                    { required: true, message: 'Please input your phone number!' }
                                ]}
                            >
                                <Input placeholder="Enter your phone number" />
                            </Form.Item>

                            <Form.Item
                                name="address"
                                label="Address"
                                rules={[{ required: true, message: 'Please input your address!' }]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col xs={24} sm={8}>
                                    <Form.Item
                                        name="city"
                                        label="City"
                                        rules={[{ required: true, message: 'Please input your city!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item
                                        name="state"
                                        label="State/Province"
                                        rules={[{ required: true, message: 'Please input your state/province!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item
                                        name="zipCode"
                                        label="ZIP/Postal Code"
                                        rules={[{ required: true, message: 'Please input your ZIP/postal code!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={loading}
                                    style={{ width: '100%' }}
                                >
                                    Place Order
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Order Summary">
                        <Table
                            columns={columns}
                            dataSource={cartItems}
                            pagination={false}
                            rowKey="id"
                            size="small"
                        />

                        <div style={{ marginTop: '16px', padding: '16px', background: token.colorFillAlter, borderRadius: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Text>Subtotal:</Text>
                                <Text>{formatPrice(totalPrice)}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Text>Shipping:</Text>
                                <Text>{formatPrice(0)}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
                                <Text strong>Total:</Text>
                                <Text strong>{formatPrice(totalPrice)}</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutPage;
