import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Button, Row, Col, Spin, message, Input, Select, Pagination, Slider, Checkbox, Empty } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from '@/components/AddToCartButton.jsx';
import { productService } from '@/services/product.service.js';
import { categoryService } from '@/services/category.service.js';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [factories, setFactories] = useState([]);
    const [selectedFactories, setSelectedFactories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 100000000]);

    const pageSize = 12;
    const navigate = useNavigate();

    // Fetch available factories
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const res = await productService.getFactories();
                setFactories(res || []);
            } catch (e) {
                console.error(e);
            }
        };
        fetchMeta();
    }, []);

    // Load products with filters
    const loadProducts = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage - 1,
                size: pageSize,
                sortBy: sortBy, // Fixed param name
                sortDir: sortOrder, // Fixed param name
                keyword: searchTerm,
                factory: selectedFactories,
                minPrice: priceRange[0],
                maxPrice: priceRange[1]
            };

            const result = await productService.filter(params);
            const data = result.data || result;

            if (data.content) {
                const filtered = data.content.filter(p => (p.quantity ?? p.stock ?? 0) > 0);
                setProducts(filtered);
                setTotalProducts(data.totalElements);
            } else {
                setProducts([]);
                setTotalProducts(0);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            message.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    // Debounce effect for search and filters
    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [currentPage, searchTerm, selectedFactories, priceRange, sortBy, sortOrder]);

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={24}>
                {/* Sidebar Filter */}
                <Col xs={24} md={6} lg={5}>
                    <Card title="Filters" style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Search</div>
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Price Range</div>
                            <Slider
                                range
                                min={0}
                                max={100000000}
                                defaultValue={[0, 100000000]}
                                onChange={(val) => {
                                    setPriceRange(val);
                                    setCurrentPage(1);
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                <span>{formatPrice(priceRange[0])}</span>
                                <span>{formatPrice(priceRange[1])}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Brands</div>
                            <Checkbox.Group
                                options={factories}
                                value={selectedFactories}
                                onChange={(val) => {
                                    setSelectedFactories(val);
                                    setCurrentPage(1);
                                }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                            />
                        </div>

                        <Button onClick={() => {
                            setSearchTerm('');
                            setSelectedFactories([]);
                            setPriceRange([0, 100000000]);
                            setCurrentPage(1);
                        }} block>
                            Reset Filters
                        </Button>
                    </Card>
                </Col>

                {/* Product List */}
                <Col xs={24} md={18} lg={19}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Title level={2} style={{ margin: 0 }}>Products</Title>
                        <Select
                            defaultValue="id_desc"
                            style={{ width: 150 }}
                            onChange={(val) => {
                                const [s, o] = val.split('_');
                                setSortBy(s);
                                setSortOrder(o);
                            }}
                        >
                            <Option value="id_desc">Newest</Option>
                            <Option value="price_asc">Price: Low to High</Option>
                            <Option value="price_desc">Price: High to Low</Option>
                        </Select>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large" />
                        </div>
                    ) : products.length === 0 ? (
                        <Card><Empty description="No products found" /></Card>
                    ) : (
                        <>
                            <Row gutter={[16, 16]}>
                                {products.map(product => (
                                    <Col xs={24} sm={12} lg={8} xl={6} key={product.id}>
                                        <Card
                                            hoverable
                                            cover={
                                                <img
                                                    alt={product.name}
                                                    src={product.image || 'https://via.placeholder.com/300x200'}
                                                    style={{ height: 180, objectFit: 'cover' }}
                                                    onClick={() => handleProductClick(product.id)}
                                                />
                                            }
                                            actions={[
                                                <AddToCartButton product={product} size="small" compact showQuantity={false} />
                                            ]}
                                        >
                                            <Card.Meta
                                                title={<div onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer' }}>{product.name}</div>}
                                                description={
                                                    <div>
                                                        <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                                                            {formatPrice(product.price)}
                                                        </Text>
                                                        <div style={{ fontSize: 12, color: '#666' }}>{product.factory}</div>
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {totalProducts > pageSize && (
                                <div style={{ textAlign: 'center', marginTop: 24 }}>
                                    <Pagination
                                        current={currentPage}
                                        total={totalProducts}
                                        pageSize={pageSize}
                                        onChange={setCurrentPage}
                                        showSizeChanger={false}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ProductPage;
