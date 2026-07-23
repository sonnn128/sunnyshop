import React, { useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Button, Table, InputNumber, Empty, Spin, message, Input, theme, Select } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '@/contexts/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import { couponService } from '@/services/coupon.service';

const { Title } = Typography;

const CartPage = () => {
    const { token } = theme.useToken();
    const {
        cartItems,
        totalPrice,
        loading,
        error,
        updateQuantity,
        removeFromCart,
        clearCart,
        loadCartFromServer
    } = useCart();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = React.useState('');
    const [discount, setDiscount] = React.useState(0);
    const [appliedCoupon, setAppliedCoupon] = React.useState(null);
    const [activeCoupons, setActiveCoupons] = React.useState([]);

    // Load cart from server when component mounts
    useEffect(() => {
        loadCartFromServer();
        fetchActiveCoupons();
    }, []);

    const fetchActiveCoupons = async () => {
        try {
            const data = await couponService.getActive();
            setActiveCoupons(data || []);
        } catch (error) {
            console.error('Failed to load active coupons', error);
        }
    };

    // Show error message if there's an error
    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const handleQuantityChange = async (record, value) => {
        if (value && value > 0) {
            await updateQuantity(record.id, value, record.size, record.color);
        }
    };

    const handleRemoveItem = async (record) => {
        await removeFromCart(record.id, record.size, record.color);
        message.success('Đã xóa sản phẩm khỏi giỏ hàng');
    };

    const handleClearCart = async () => {
        await clearCart();
        message.success('Đã xóa toàn bộ giỏ hàng');
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            message.warning('Giỏ hàng đang trống');
            return;
        }
        navigate('/checkout');
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                        src={record.image || 'https://via.placeholder.com/60x60?text=No+Image'}
                        alt={text}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }}
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
            render: (quantity, record) => (
                <InputNumber
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(value) => handleQuantityChange(record, value)}
                    disabled={loading}
                />
            ),
            width: 120,
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (_, record) => formatPrice(record.price * record.quantity),
            width: 120,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record)}
                    loading={loading}
                >
                    Xóa
                </Button>
            ),
            width: 100,
        },
    ];

    if (loading && cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Đang tải giỏ hàng...</div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div>
                <Title level={2}>Giỏ hàng</Title>
                <Card>
                    <Empty
                        image={<ShoppingCartOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
                        description="Giỏ hàng đang trống"
                        style={{ padding: '50px 0' }}
                    >
                        <Button type="primary" onClick={() => navigate('/products')}>
                            Tiếp tục mua sắm
                        </Button>
                    </Empty>
                </Card>
            </div>
        );
    }



    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            message.error('Please enter a coupon code');
            return;
        }
        try {
            const coupon = await couponService.validate(couponCode, totalPrice);
            
            let calculatedDiscount = 0;
            if (coupon.discountType === 'PERCENTAGE') {
                calculatedDiscount = (totalPrice * coupon.discountValue) / 100;
                if (coupon.maxDiscountAmount && calculatedDiscount > coupon.maxDiscountAmount) {
                    calculatedDiscount = coupon.maxDiscountAmount;
                }
            } else {
                calculatedDiscount = coupon.discountValue;
            }

            setDiscount(calculatedDiscount);
            setAppliedCoupon(coupon);
            message.success('Đã áp dụng mã giảm giá!');
            // Save to local storage or context if needed for checkout
            localStorage.setItem('coupon', JSON.stringify(coupon));
        } catch (e) {
            message.error(typeof e === 'string' ? e : (e.response?.data?.message || 'Mã giảm giá không hợp lệ'));
            setDiscount(0);
            setAppliedCoupon(null);
        }
    };

    const finalPrice = Math.max(0, totalPrice - discount);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}>Giỏ hàng ({cartItems.length} sản phẩm)</Title>
                <Button
                    danger
                    onClick={handleClearCart}
                    loading={loading}
                >
                    Xóa giỏ hàng
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={cartItems}
                    pagination={false}
                    rowKey="id"
                    loading={loading}
                />

                <div style={{
                    marginTop: '24px',
                    padding: '20px',
                    background: token.colorFillAlter,
                    borderRadius: '8px',
                    textAlign: 'right'
                }}>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontWeight: 'bold' }}>Coupon:</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Select
                                placeholder="Chọn mã giảm giá"
                                value={couponCode || undefined}
                                onChange={(val) => setCouponCode(val)}
                                style={{ width: 250, textAlign: 'left' }}
                                disabled={!!appliedCoupon}
                                allowClear
                                options={activeCoupons.map(c => ({
                                    value: c.code,
                                    label: `${c.code} - Giảm ${c.discountType === 'PERCENTAGE' ? c.discountValue + '%' : formatPrice(c.discountValue)}`
                                }))}
                            />
                            {appliedCoupon ? (
                                <Button onClick={() => {
                                    setAppliedCoupon(null);
                                    setDiscount(0);
                                    setCouponCode('');
                                    localStorage.removeItem('coupon');
                                }}>Xóa</Button>
                            ) : (
                                <Button type="primary" onClick={handleApplyCoupon}>Áp dụng</Button>
                            )}
                        </div>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                        <Title level={4} style={{ margin: 0, fontWeight: 'normal' }}>
                            Tạm tính: {formatPrice(totalPrice)}
                        </Title>
                    </div>
                    {discount > 0 && (
                        <div style={{ marginBottom: '8px', color: 'green' }}>
                            <Title level={4} style={{ margin: 0, fontWeight: 'normal' }}>
                                Giảm giá: -{formatPrice(discount)}
                            </Title>
                        </div>
                    )}
                    <div style={{ marginBottom: '16px' }}>
                        <Title level={3} style={{ margin: 0 }}>
                            Tổng cộng: {formatPrice(finalPrice)}
                        </Title>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <Button
                            size="large"
                            onClick={() => navigate('/products')}
                        >
                            Tiếp tục mua sắm
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleCheckout}
                            loading={loading}
                        >
                            Tiến hành thanh toán
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CartPage;
