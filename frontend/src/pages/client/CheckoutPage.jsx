import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Form, Input, Button, Row, Col, Table, message, Empty, theme, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import api from '@/config/api.js';

const { Title, Text } = Typography;

const CheckoutPage = () => {
    const { token } = theme.useToken();
    const { cartItems: rawCartItems, clearCart, removeFromCart } = useCart();

    const checkoutItemKeys = React.useMemo(() => {
        const saved = localStorage.getItem('checkoutItemKeys');
        return saved ? JSON.parse(saved) : null;
    }, []);

    const cartItems = React.useMemo(() => {
        if (!checkoutItemKeys) return rawCartItems;
        return rawCartItems.filter(item => {
            const key = `${item.id}-${item.size || ''}-${item.color || ''}`;
            return checkoutItemKeys.includes(key);
        });
    }, [rawCartItems, checkoutItemKeys]);

    const totalPrice = React.useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cartItems]);

    const { user } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD');
    const orderCompletedRef = React.useRef(false);

    useEffect(() => {
        if (cartItems.length === 0 && !orderCompletedRef.current) {
            message.warning('Giỏ hàng đang trống');
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const onFinish = async (values) => {
        if (cartItems.length === 0) {
            message.error('Giỏ hàng đang trống');
            return;
        }

        let orderData = null;
        try {
            setLoading(true);

            orderData = {
                receiverName: `${values.firstName} ${values.lastName}`.trim(),
                receiverAddress: `${values.address}, ${values.city}, ${values.state} ${values.zipCode}`.trim(),
                receiverPhone: values.phone || 'N/A',
                paymentMethod: values.paymentMethod || 'COD',
                cartItems: cartItems.map(item => ({
                    productId: parseInt(item.id),
                    quantity: parseInt(item.quantity),
                    size: item.size || "",
                    color: item.color || ""
                }))
            };

            const response = await api.post('/orders', orderData);

            if (response.status === 201 && response.data) {
                const createdOrder = response.data;
                
                if (orderData.paymentMethod === 'VNPAY') {
                    setLoading(true);
                    const paymentRes = await api.get(`/payment/vnpay/create-payment?amount=${createdOrder.totalPrice}&orderInfo=Thanh toan don hang ${createdOrder.id}&orderId=${createdOrder.id}`);
                    if (paymentRes.data && paymentRes.data.url) {
                        // Cart will be cleared by the backend only after successful payment
                        window.location.href = paymentRes.data.url;
                        return;
                    } else {
                        message.error('Failed to initiate VNPay check out');
                    }
                }

                message.success('Đặt hàng thành công!');
                orderCompletedRef.current = true;
                if (checkoutItemKeys) {
                    for (const key of checkoutItemKeys) {
                        const [id, size, color] = key.split('-');
                        await removeFromCart(Number(id), size, color);
                    }
                } else {
                    await clearCart();
                }
                localStorage.removeItem('checkoutItemKeys');
                localStorage.removeItem('coupon');
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
                        await removeFromCart(offending.id, offending.size, offending.color);
                        message.error(`${productName} đã hết hàng và được tự động xóa khỏi giỏ hàng. Vui lòng kiểm tra lại giỏ hàng.`);
                    } catch (e) {
                        console.error('Failed to remove out-of-stock item from cart:', e);
                        message.error(serverMessage || 'Một số sản phẩm đã hết hàng. Vui lòng kiểm tra lại giỏ hàng.');
                    }
                } else {
                    message.error(serverMessage);
                }
            } else {
                const errorMessage = serverMessage || 'Đặt hàng thất bại. Vui lòng thử lại sau.';
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Sản phẩm',
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
                            <div style={{ color: '#666', fontSize: '12px' }}>bởi {record.factory}</div>
                        )}
                        {(record.size || record.color) && (
                            <div style={{ marginTop: '4px', display: 'flex', gap: '8px' }}>
                                {record.size && <span style={{ padding: '2px 8px', fontSize: '11px', backgroundColor: '#F3F4F6', borderRadius: '4px', color: '#4B5563', fontWeight: 500 }}>Size: {record.size}</span>}
                                {record.color && <span style={{ padding: '2px 8px', fontSize: '11px', backgroundColor: '#F3F4F6', borderRadius: '4px', color: '#4B5563', fontWeight: 500 }}>Màu: {record.color}</span>}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatPrice(price),
            width: 120,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (_, record) => formatPrice(record.price * record.quantity),
            width: 120,
        },
    ];

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Empty description="Giỏ hàng đang trống" />
                <Button type="primary" onClick={() => navigate('/products')}>
                    Tiếp tục mua sắm
                </Button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px 48px' }}>
            <Title level={3} style={{ fontWeight: 700, marginBottom: '24px', color: '#ee4d2d', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🛍️ Thanh toán đơn hàng
            </Title>

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
                {/* PHẦN 1: ĐỊA CHỈ NHẬN HÀNG */}
                <Card 
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ee4d2d' }}>
                            <span style={{ fontSize: '18px' }}>📍</span>
                            <span>Địa Chỉ Nhận Hàng</span>
                        </div>
                    }
                    style={{ marginBottom: '24px', borderRadius: '8px', border: '1px solid #f2f2f2', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }}
                    styles={{ header: { borderBottom: '1px solid #f2f2f2' }, body: { padding: '24px' } }}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="lastName"
                                label="Họ và tên lót"
                                rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                            >
                                <Input placeholder="Ví dụ: Nguyễn Văn" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="firstName"
                                label="Tên"
                                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                            >
                                <Input placeholder="Ví dụ: Anh" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại liên hệ"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input placeholder="Nhập số điện thoại..." size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="address"
                                label="Địa chỉ cụ thể (Số nhà, đường...)"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng!' }]}
                            >
                                <Input placeholder="Ví dụ: Số 12, ngõ 45, đường Cầu Giấy" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item
                                name="city"
                                label="Tỉnh / TP"
                                rules={[{ required: true, message: 'Vui lòng nhập tỉnh / thành phố!' }]}
                            >
                                <Input placeholder="Hà Nội" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item
                                name="state"
                                label="Quận / Huyện"
                                rules={[{ required: true, message: 'Vui lòng nhập quận / huyện!' }]}
                            >
                                <Input placeholder="Cầu Giấy" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item
                                name="zipCode"
                                label="Mã ZIP"
                                rules={[{ required: true, message: 'Vui lòng nhập mã bưu chính!' }]}
                            >
                                <Input placeholder="100000" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* PHẦN 2: THÔNG TIN SẢN PHẨM */}
                <Card 
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#222' }}>
                            <span style={{ fontSize: '18px' }}>📦</span>
                            <span>Sản phẩm thanh toán</span>
                        </div>
                    }
                    style={{ marginBottom: '24px', borderRadius: '8px', border: '1px solid #f2f2f2', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }}
                    styles={{ header: { borderBottom: '1px solid #f2f2f2' }, body: { padding: 0 } }}
                >
                    <Table
                        columns={columns}
                        dataSource={cartItems}
                        pagination={false}
                        rowKey="id"
                        size="middle"
                        style={{ width: '100%' }}
                    />
                </Card>

                {/* PHẦN 3: PHƯƠNG THỨC THANH TOÁN & TỔNG TIỀN */}
                <Card 
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#222' }}>
                            <span style={{ fontSize: '18px' }}>💳</span>
                            <span>Phương thức thanh toán</span>
                        </div>
                    }
                    style={{ marginBottom: '24px', borderRadius: '8px', border: '1px solid #f2f2f2', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }}
                    styles={{ header: { borderBottom: '1px solid #f2f2f2' }, body: { padding: '24px' } }}
                >
                    <Form.Item
                        name="paymentMethod"
                        label="Phương thức thanh toán"
                        rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                        initialValue="COD"
                        style={{ marginBottom: 24 }}
                    >
                        <Radio.Group 
                            value={selectedPaymentMethod}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <Card 
                                        size="small" 
                                        style={{ 
                                            cursor: 'pointer', 
                                            borderRadius: '8px', 
                                            border: selectedPaymentMethod === 'COD' ? '1px solid #ee4d2d' : '1px solid #f0f0f0',
                                            backgroundColor: selectedPaymentMethod === 'COD' ? '#fffaf8' : '#fff'
                                        }} 
                                        onClick={() => {
                                            setSelectedPaymentMethod('COD');
                                            form.setFieldsValue({ paymentMethod: 'COD' });
                                        }}
                                    >
                                        <Radio value="COD"><span style={{ fontWeight: 600 }}>Thanh toán khi nhận hàng (COD)</span></Radio>
                                        <div style={{ marginLeft: 24, fontSize: '13px', color: '#6B7280', marginTop: 4 }}>Thanh toán bằng tiền mặt trực tiếp cho shipper khi nhận được hàng.</div>
                                    </Card>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Card 
                                        size="small" 
                                        style={{ 
                                            cursor: 'pointer', 
                                            borderRadius: '8px', 
                                            border: selectedPaymentMethod === 'VNPAY' ? '1px solid #ee4d2d' : '1px solid #f0f0f0',
                                            backgroundColor: selectedPaymentMethod === 'VNPAY' ? '#fffaf8' : '#fff'
                                        }} 
                                        onClick={() => {
                                            setSelectedPaymentMethod('VNPAY');
                                            form.setFieldsValue({ paymentMethod: 'VNPAY' });
                                        }}
                                    >
                                        <Radio value="VNPAY"><span style={{ fontWeight: 600 }}>Thanh toán trực tuyến (VNPay / Thẻ ATM)</span></Radio>
                                        <div style={{ marginLeft: 24, fontSize: '13px', color: '#6B7280', marginTop: 4 }}>Thanh toán chuyển khoản trực tuyến cực nhanh và bảo mật qua cổng VNPay.</div>
                                    </Card>
                                </Col>
                            </Row>
                        </Radio.Group>
                    </Form.Item>

                    <div style={{
                        marginTop: '24px',
                        padding: '20px 24px',
                        background: '#fffbf8',
                        borderRadius: '8px',
                        border: '1px solid #fde8e4',
                        textAlign: 'right'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '24px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <Text style={{ color: '#757575', fontSize: '14px' }}>Tổng tiền hàng:</Text>
                            <Text style={{ minWidth: '120px', fontSize: '14px' }}>{formatPrice(totalPrice)}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '24px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <Text style={{ color: '#757575', fontSize: '14px' }}>Phí vận chuyển:</Text>
                            <Text style={{ minWidth: '120px', fontSize: '14px', color: 'green' }}>Miễn phí</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '24px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Text strong style={{ fontSize: '16px', color: '#222' }}>Tổng thanh toán:</Text>
                            <Text strong style={{ minWidth: '120px', fontSize: '24px', color: '#ee4d2d' }}>
                                {formatPrice(totalPrice)}
                            </Text>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                style={{
                                    height: '48px',
                                    padding: '0 48px',
                                    borderRadius: '2px',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    backgroundColor: '#ee4d2d',
                                    borderColor: '#ee4d2d',
                                    color: '#fff',
                                    boxShadow: '0 1px 1px 0 rgba(0,0,0,.09)'
                                }}
                            >
                                Đặt hàng ngay
                            </Button>
                        </div>
                    </div>
                </Card>
            </Form>
        </div>
    );
};

export default CheckoutPage;
