import React, { useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Button, Table, InputNumber, Empty, Spin, message, Input, theme } from 'antd';
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

    // Load cart from server when component mounts
    useEffect(() => {
        loadCartFromServer();
    }, []);

    // Show error message if there's an error
    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const handleQuantityChange = async (productId, value) => {
        if (value && value > 0) {
            await updateQuantity(productId, value);
        }
    };

    const handleRemoveItem = async (productId) => {
        await removeFromCart(productId);
        message.success('Item removed from cart');
    };

    const handleClearCart = async () => {
        await clearCart();
        message.success('Cart cleared');
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            message.warning('Your cart is empty');
            return;
        }
        navigate('/checkout');
    };

    const columns = [
        {
            title: 'Product',
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
            width: 120,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity, record) => (
                <InputNumber
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(value) => handleQuantityChange(record.id, value)}
                    disabled={loading}
                />
            ),
            width: 120,
        },
        {
            title: 'Total',
            key: 'total',
            render: (_, record) => formatPrice(record.price * record.quantity),
            width: 120,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.id)}
                    loading={loading}
                >
                    Remove
                </Button>
            ),
            width: 100,
        },
    ];

    if (loading && cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Loading cart...</div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div>
                <Title level={2}>Shopping Cart</Title>
                <Card>
                    <Empty
                        image={<ShoppingCartOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
                        description="Your cart is empty"
                        style={{ padding: '50px 0' }}
                    >
                        <Button type="primary" onClick={() => navigate('/products')}>
                            Continue Shopping
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
            const res = await couponService.checkCoupon(couponCode);
            if (res.success) {
                const coupon = res.data;
                // Currently only fixed discount supported
                if (coupon.minOrderAmount && totalPrice < coupon.minOrderAmount) {
                    message.error(`Minimum order amount is ${formatPrice(coupon.minOrderAmount)}`);
                    return;
                }
                setDiscount(coupon.discountAmount);
                setAppliedCoupon(coupon);
                message.success('Coupon applied!');
                // Save to local storage or context if needed for checkout
                localStorage.setItem('coupon', JSON.stringify(coupon));
            } else {
                message.error(res.message);
            }
        } catch (e) {
            message.error(e.response?.data?.message || 'Invalid coupon');
            setDiscount(0);
            setAppliedCoupon(null);
        }
    };

    const finalPrice = Math.max(0, totalPrice - discount);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}>Shopping Cart ({cartItems.length} items)</Title>
                <Button
                    danger
                    onClick={handleClearCart}
                    loading={loading}
                >
                    Clear Cart
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
                            <Input
                                placeholder="Enter code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                style={{ width: 150 }}
                                disabled={!!appliedCoupon}
                            />
                            {appliedCoupon ? (
                                <Button onClick={() => {
                                    setAppliedCoupon(null);
                                    setDiscount(0);
                                    setCouponCode('');
                                    localStorage.removeItem('coupon');
                                }}>Remove</Button>
                            ) : (
                                <Button type="primary" onClick={handleApplyCoupon}>Apply</Button>
                            )}
                        </div>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                        <Title level={4} style={{ margin: 0, fontWeight: 'normal' }}>
                            Subtotal: {formatPrice(totalPrice)}
                        </Title>
                    </div>
                    {discount > 0 && (
                        <div style={{ marginBottom: '8px', color: 'green' }}>
                            <Title level={4} style={{ margin: 0, fontWeight: 'normal' }}>
                                Discount: -{formatPrice(discount)}
                            </Title>
                        </div>
                    )}
                    <div style={{ marginBottom: '16px' }}>
                        <Title level={3} style={{ margin: 0 }}>
                            Total: {formatPrice(finalPrice)}
                        </Title>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <Button
                            size="large"
                            onClick={() => navigate('/products')}
                        >
                            Continue Shopping
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleCheckout}
                            loading={loading}
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CartPage;
