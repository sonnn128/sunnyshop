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
            message.error('Failed to load product details');
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
                message.success('Removed from wishlist');
            } else {
                await wishlistService.addToWishlist(id);
                setInWishlist(true);
                message.success('Added to wishlist');
            }
        } catch (e) {
            message.error('Please login to use wishlist');
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
            message.success('Review submitted');
            form.resetFields();
            loadReviews();
        } catch (e) {
            message.error('Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Loading product details...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Text type="secondary">Product not found</Text>
                <br />
                <Button type="primary" onClick={() => navigate('/products')}>
                    Back to Products
                </Button>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/products')}
                style={{ marginBottom: '16px' }}
            >
                Back to Products
            </Button>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                    <img
                        src={product.image || 'https://via.placeholder.com/500x400?text=No+Image'}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: '8px' }}
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Title level={2}>{product.name}</Title>
                            <Button
                                type="text"
                                icon={inWishlist ? <HeartFilled style={{ color: 'red', fontSize: 24 }} /> : <HeartOutlined style={{ fontSize: 24 }} />}
                                loading={wishlistLoading}
                                onClick={toggleWishlist}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <Text style={{ fontSize: '24px', color: '#1890ff', fontWeight: 'bold' }}>
                                {formatPrice(product.price)}
                            </Text>
                        </div>

                        {product.factory && (
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong>Manufacturer: </Text>
                                <Tag color="blue">{product.factory}</Tag>
                            </div>
                        )}

                        {product.categoryName && (
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong>Category: </Text>
                                <Tag color="green">{product.categoryName}</Tag>
                            </div>
                        )}

                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Stock: </Text>
                            <Tag color={product.quantity > 0 ? 'green' : 'red'}>
                                {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
                            </Tag>
                        </div>

                        <Divider />

                        <Paragraph style={{ fontSize: '16px' }}>
                            {product.description || 'No description available for this product.'}
                        </Paragraph>

                        {product.target && (
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong>Target Audience: </Text>
                                <Text>{product.target}</Text>
                            </div>
                        )}

                        <Divider />

                        <div style={{ marginBottom: '24px' }}>
                            <AddToCartButton
                                product={product}
                                size="large"
                                showQuantity={true}
                            />
                        </div>

                        {product.quantity === 0 && (
                            <div style={{
                                padding: '12px',
                                background: '#fff2f0',
                                border: '1px solid #ffccc7',
                                borderRadius: '6px',
                                marginTop: '16px'
                            }}>
                                <Text type="danger">
                                    This product is currently out of stock. Please check back later.
                                </Text>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            <Divider orientation="left">Reviews ({reviews.length})</Divider>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                    <Card title="Write a Review">
                        <Form form={form} onFinish={handleReviewSubmit} layout="vertical">
                            <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
                                <Rate />
                            </Form.Item>
                            <Form.Item name="comment" label="Comment" rules={[{ required: true, message: 'Please write a comment' }]}>
                                <TextArea rows={4} />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" loading={submittingReview}>
                                Submit Review
                            </Button>
                        </Form>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <List
                        itemLayout="horizontal"
                        dataSource={reviews}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} src={item.user?.avatar} />}
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{item.user?.fullName || item.user?.username || 'User'}</span>
                                            <Rate disabled defaultValue={item.rating} style={{ fontSize: 14 }} />
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <div>{item.comment}</div>
                                            <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                                                {new Date(item.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>

            <Divider />
            <RecentlyViewed />
        </div>
    );
};

export default ProductDetailPage;
