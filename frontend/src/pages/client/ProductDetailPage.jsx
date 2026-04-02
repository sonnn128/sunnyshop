import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Button, Row, Col, Spin, message, Tag, Divider, Rate, List, Avatar, Input, Form } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined, HeartOutlined, HeartFilled, UserOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import AddToCartButton from '@/components/AddToCartButton.jsx';
import { productService } from '@/services/product.service.js';
import { wishlistService } from '@/services/wishlist.service.js';
import { reviewService } from '@/services/review.service.js';
import { pushView } from '@/utils/recentViews.js';
import RecentlyViewed from '@/components/RecentlyViewed.jsx';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Wishlist State
    const [inWishlist, setInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Review State
    const [reviews, setReviews] = useState([]);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (id) {
            loadProduct();
            checkWishlistStatus();
            loadReviews();
        }
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const result = await productService.getById(id);
            const data = result.data || result;
            setProduct(data);
            pushView(data);
        } catch (error) {
            console.error('Error loading product:', error);
            message.error('Không tìm thấy thông tin sản phẩm');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const checkWishlistStatus = async () => {
        try {
            const res = await wishlistService.checkWishlist(id);
            setInWishlist(res.data);
        } catch (e) {
            // Ignore if not logged in
        }
    };

    const loadReviews = async () => {
        try {
            const res = await reviewService.getReviewsByProduct(id);
            setReviews(res.data || []);
        } catch (e) {
            console.error(e);
        }
    }

    const toggleWishlist = async () => {
        if (wishlistLoading) return;
        setWishlistLoading(true);
        try {
            if (inWishlist) {
                await wishlistService.removeFromWishlist(id);
                setInWishlist(false);
                message.success('Đã bỏ khỏi danh sách yêu thích');
            } else {
                await wishlistService.addToWishlist(id);
                setInWishlist(true);
                message.success('Đã thêm vào danh sách yêu thích');
            }
        } catch (e) {
            message.error('Vui lòng đăng nhập để lưu sản phẩm');
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleReviewSubmit = async (values) => {
        try {
            setSubmittingReview(true);
            const payload = {
                productId: id,
                rating: values.rating,
                comment: values.comment
            };
            await reviewService.addReview(payload);
            message.success('Đã gửi đánh giá thành công');
            form.resetFields();
            loadReviews();
        } catch (e) {
            message.error('Gửi đánh giá thất bại');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0', minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Spin size="large" />
                <div style={{ marginTop: '24px', color: '#6B7280', fontSize: '16px' }}>Đang tải thông tin sản phẩm...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Text type="secondary" style={{ fontSize: '18px' }}>Không tìm thấy sản phẩm</Text>
                <br />
                <Button type="primary" size="large" onClick={() => navigate('/products')} style={{ marginTop: '24px', borderRadius: '24px', backgroundColor: '#4F46E5' }}>
                    Quay lại cửa hàng
                </Button>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", backgroundColor: '#F9FAFB', minHeight: '100vh', paddingBottom: '80px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 5%' }}>
                {/* Back Button */}
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/products')}
                    style={{ marginBottom: '24px', color: '#6B7280', fontSize: '16px', padding: 0 }}
                >
                    Trở về cửa hàng
                </Button>

                <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '60px' }} bodyStyle={{ padding: 0 }}>
                    <Row gutter={[0, 0]}>
                        {/* Image Section */}
                        <Col xs={24} md={12} lg={14}>
                            <div style={{ backgroundColor: '#F3F4F6', height: '100%', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                                <img
                                    src={product.image || 'https://via.placeholder.com/800x800?text=Chưa+có+ảnh'}
                                    alt={product.name}
                                    style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain', borderRadius: '16px', transition: 'transform 0.3s ease' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                />
                            </div>
                        </Col>

                        {/* Details Section */}
                        <Col xs={24} md={12} lg={10}>
                            <div style={{ padding: '40px 40px 40px 40px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div>
                                        <Text style={{ fontSize: '14px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                                            {product.factory || 'Thương Hiệu Riêng'}
                                        </Text>
                                        <Title level={1} style={{ margin: '8px 0 16px 0', fontSize: '32px', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                                            {product.name}
                                        </Title>
                                    </div>
                                    <Button
                                        type="text"
                                        shape="circle"
                                        size="large"
                                        icon={inWishlist ? <HeartFilled style={{ color: '#EF4444', fontSize: '28px' }} /> : <HeartOutlined style={{ fontSize: '28px', color: '#6B7280' }} />}
                                        loading={wishlistLoading}
                                        onClick={toggleWishlist}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <Text style={{ fontSize: '32px', color: '#4F46E5', fontWeight: 800 }}>
                                        {formatPrice(product.price)}
                                    </Text>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                    {product.categoryName && (
                                        <Tag style={{ padding: '4px 12px', fontSize: '14px', borderRadius: '16px', border: 'none', backgroundColor: '#F3F4F6', color: '#374151' }}>
                                            Mục: {product.categoryName}
                                        </Tag>
                                    )}
                                    <Tag color={product.quantity > 0 ? '#10B981' : '#EF4444'} style={{ padding: '4px 12px', fontSize: '14px', borderRadius: '16px', border: 'none' }}>
                                        {product.quantity > 0 ? `Còn ${product.quantity} sản phẩm` : 'Hết hàng'}
                                    </Tag>
                                    {product.target && (
                                        <Tag style={{ padding: '4px 12px', fontSize: '14px', borderRadius: '16px', border: 'none', backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                                            {product.target}
                                        </Tag>
                                    )}
                                </div>

                                <Divider style={{ margin: '24px 0' }} />

                                <div style={{ flex: 1 }}>
                                    <Title level={4} style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Mô tả sản phẩm</Title>
                                    <Paragraph style={{ fontSize: '16px', color: '#4B5563', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                        {product.description || 'Sản phẩm này chưa có mô tả chi tiết.'}
                                    </Paragraph>
                                </div>

                                <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                                    <AddToCartButton
                                        product={product}
                                        size="large"
                                        showQuantity={true}
                                    />
                                    {product.quantity === 0 && (
                                        <div style={{
                                            padding: '16px',
                                            backgroundColor: '#FEF2F2',
                                            borderRadius: '12px',
                                            marginTop: '16px',
                                            textAlign: 'center'
                                        }}>
                                            <Text style={{ color: '#EF4444', fontWeight: 600 }}>
                                                Sản phẩm hiện đang tạm hết hàng. Vui lòng quay lại sau!
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Reviews Section */}
                <div style={{ marginBottom: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
                        <Title level={3} style={{ margin: 0, fontWeight: 800, fontSize: '28px' }}>
                            Đánh giá từ khách hàng <span style={{ color: '#6B7280', fontWeight: 500 }}>({reviews.length})</span>
                        </Title>
                    </div>

                    <Row gutter={[40, 40]}>
                        <Col xs={24} lg={8}>
                            <Card bordered={false} style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                                <Title level={4} style={{ marginBottom: '24px', fontWeight: 700 }}>Viết đánh giá của bạn</Title>
                                <Form form={form} onFinish={handleReviewSubmit} layout="vertical">
                                    <Form.Item name="rating" label={<span style={{ fontWeight: 600 }}>Chất lượng sản phẩm</span>} rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}>
                                        <Rate style={{ fontSize: '24px', color: '#F59E0B' }} />
                                    </Form.Item>
                                    <Form.Item name="comment" label={<span style={{ fontWeight: 600 }}>Nhận xét chi tiết</span>} rules={[{ required: true, message: 'Vui lòng nhập trải nghiệm của bạn' }]}>
                                        <TextArea rows={5} placeholder="Chia sẻ cảm nhận của bạn về chất liệu, kiểu dáng..." style={{ borderRadius: '12px', padding: '12px' }} />
                                    </Form.Item>
                                    <Button type="primary" htmlType="submit" size="large" loading={submittingReview} style={{ width: '100%', borderRadius: '12px', height: '48px', backgroundColor: '#111827', fontWeight: 600 }}>
                                        Gửi đánh giá
                                    </Button>
                                </Form>
                            </Card>
                        </Col>
                        
                        <Col xs={24} lg={16}>
                            {reviews.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: 'white', borderRadius: '20px', border: '1px dashed #D1D5DB' }}>
                                    <Text style={{ color: '#6B7280', fontSize: '16px' }}>Chưa có đánh giá nào cho sản phẩm này.<br/>Hãy là người đầu tiên chia sẻ cảm nhận!</Text>
                                </div>
                            ) : (
                                <List
                                    itemLayout="vertical"
                                    dataSource={reviews}
                                    renderItem={item => (
                                        <Card bordered={false} style={{ marginBottom: '16px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} bodyStyle={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <Avatar size={48} icon={<UserOutlined />} src={item.user?.avatar} style={{ backgroundColor: '#F3F4F6', color: '#9CA3AF' }} />
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '16px', color: '#111827' }}>
                                                            {item.user?.fullName || item.user?.username || 'Khách hàng ẩn danh'}
                                                        </div>
                                                        <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                                                            {new Date(item.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Rate disabled defaultValue={item.rating} style={{ fontSize: '16px', color: '#F59E0B' }} />
                                            </div>
                                            <Paragraph style={{ color: '#4B5563', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                                                {item.comment}
                                            </Paragraph>
                                        </Card>
                                    )}
                                />
                            )}
                        </Col>
                    </Row>
                </div>

                <Divider style={{ margin: '60px 0' }} />
                
                {/* Recently Viewed */}
                <RecentlyViewed />
            </div>
        </div>
    );
};

export default ProductDetailPage;
