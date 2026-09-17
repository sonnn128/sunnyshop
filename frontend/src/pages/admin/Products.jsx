import React, { useState, useEffect } from 'react';
import { formatPrice, formatQuantity } from '@/utils/format';
import { productService } from '../../services/product.service.js';
import { categoryService } from '../../services/category.service.js';
import { brandService } from '../../services/brand.service.js';
import { targetService } from '../../services/target.service.js';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Typography,
  Card,
  Select,
  Image,
  Row,
  Col,
  Upload,
  Descriptions,
  Badge
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  LinkOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Variants state
  const [variantsModalVisible, setVariantsModalVisible] = useState(false);
  const [variantsProduct, setVariantsProduct] = useState(null);
  const [variantsList, setVariantsList] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importData, setImportData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Mock data
  useEffect(() => {
    fetchProducts(1, 10);
    fetchCategories();
    fetchBrands();
    fetchTargets();
  }, []);

  const fetchProducts = async (page = 1, size = 10, keyword = searchKeyword) => {
    setLoading(true);
    try {
      const response = keyword.trim()
        ? await productService.search(keyword.trim(), page - 1, size)
        : await productService.getAll({
            page: page - 1, // API is 0-indexed
            size: size
          });
      // console.log("DEBUG RESPONSE:", response);

      // Handle Page object response
      const data = response.data || response;
      if (data && data.content) {
        // It's a Page object
        setProducts(Array.isArray(data.content) ? data.content : []);

        // Check for totalElements at root or inside 'page' object
        const total = data.totalElements ?? data.page?.totalElements ?? 0;

        setPagination({
          current: page,
          pageSize: size,
          total: total
        });
      } else if (Array.isArray(data)) {
        // It's a direct array (fallback)
        setProducts(data);
        setPagination({
          current: 1,
          pageSize: data.length,
          total: data.length
        });
      } else {
        setProducts([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
      // Clear selection on page change or refresh
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      message.error('Failed to fetch products from API');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    fetchProducts(newPagination.current, newPagination.pageSize);
  };

  const handleSearch = (value) => {
    setSearchKeyword(value);
    fetchProducts(1, pagination.pageSize, value);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleBulkDelete = async () => {
    try {
      await productService.bulkDelete(selectedRowKeys);
      message.success(`Đã xóa thành công ${selectedRowKeys.length} sản phẩm`);
      setSelectedRowKeys([]);
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Failed to delete products:', error);
      message.error('Xóa sản phẩm thất bại');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      // Ensure we always set an array
      const data = response.data || response;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('Tải danh mục thất bại');
      setCategories([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await brandService.getAll();
      const data = response.data || response;
      setBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      message.error('Tải danh sách hãng thất bại');
      setBrands([]);
    }
  };

  const fetchTargets = async () => {
    try {
      const response = await targetService.getAll();
      const data = response.data || response;
      setTargets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch targets:', error);
      message.error('Tải danh sách đối tượng thất bại');
      setTargets([]);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    const sizes = record.sizes ? record.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
    const colors = record.colors ? record.colors.split(',').map(c => c.trim()).filter(Boolean) : [];
    const images = record.images ? record.images.split(',').map(img => img.trim()) : [];
    
    const formattedRecord = {
      ...record,
      sizes,
      colors,
      image: record.image || ""
    };

    colors.forEach((color, idx) => {
      formattedRecord[`colorImage_${idx}`] = images[idx] || "";
    });

    form.setFieldsValue(formattedRecord);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      message.success('Xóa sản phẩm thành công');
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Failed to delete product:', error);
      message.error('Xóa sản phẩm thất bại');
    }
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      const formData = new FormData();

      // Extract image file if exists
      let imageFile = null;
      if (values.imageFile && values.imageFile.length > 0) {
        imageFile = values.imageFile[0].originFileObj;
      }

      // Combine color images into a comma-separated string
      const colors = values.colors || [];
      const colorImages = [];
      colors.forEach((color, idx) => {
        const imgUrl = values[`colorImage_${idx}`] || "";
        colorImages.push(imgUrl.trim());
      });
      const imagesString = colorImages.join(',');

      // Determine main product image
      let mainImage = values.image ? values.image.trim() : "";
      if (!mainImage && editingProduct && editingProduct.image) {
        mainImage = editingProduct.image;
      }

      // Create product object (without the file)
      const productData = {
        name: values.name,
        price: values.price,
        quantity: values.quantity,
        factory: values.factory,
        target: values.target,
        description: values.description,
        categoryId: values.categoryId,
        image: mainImage,
        sizes: Array.isArray(values.sizes) ? values.sizes.join(',') : values.sizes || "",
        colors: Array.isArray(values.colors) ? values.colors.join(',') : values.colors || "",
        images: imagesString
      };

      formData.append('product', JSON.stringify(productData));

      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        await productService.create(formData);
        message.success('Tạo sản phẩm thành công');
      }
      setModalVisible(false);
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Failed to save product:', error);
      message.error('Lưu sản phẩm thất bại');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleManageVariants = async (product) => {
    setVariantsProduct(product);
    setVariantsModalVisible(true);
    setVariantsLoading(true);
    try {
      const existingVariants = await productService.getVariants(product.id);
      
      const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
      const colors = product.colors ? product.colors.split(',').map(c => c.trim()).filter(Boolean) : [];
      
      const combinations = [];
      
      if (sizes.length > 0 && colors.length > 0) {
        sizes.forEach(s => {
          colors.forEach(c => {
            const match = existingVariants.find(v => v.size === s && v.color === c);
            combinations.push({
              key: `${s}-${c}`,
              size: s,
              color: c,
              quantity: match ? match.quantity : 0
            });
          });
        });
      } else if (sizes.length > 0) {
        sizes.forEach(s => {
          const match = existingVariants.find(v => v.size === s && (!v.color || v.color === ""));
          combinations.push({
            key: `${s}-`,
            size: s,
            color: "",
            quantity: match ? match.quantity : 0
          });
        });
      } else if (colors.length > 0) {
        colors.forEach(c => {
          const match = existingVariants.find(v => (!v.size || v.size === "") && v.color === c);
          combinations.push({
            key: `-${c}`,
            size: "",
            color: c,
            quantity: match ? match.quantity : 0
          });
        });
      }
      
      setVariantsList(combinations);
    } catch (error) {
      console.error("Failed to load variants:", error);
      message.error("Không thể tải thông tin biến thể");
    } finally {
      setVariantsLoading(false);
    }
  };

  const handleSaveVariants = async () => {
    try {
      setVariantsLoading(true);
      const payload = variantsList.map(v => ({
        size: v.size,
        color: v.color,
        quantity: v.quantity
      }));
      await productService.updateVariants(variantsProduct.id, payload);
      message.success("Cập nhật số lượng biến thể thành công!");
      setVariantsModalVisible(false);
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("Failed to save variants:", error);
      message.error("Lưu biến thể thất bại");
    } finally {
      setVariantsLoading(false);
    }
  };

  const updateVariantQty = (key, val) => {
    setVariantsList(prev => prev.map(item => item.key === key ? { ...item, quantity: val || 0 } : item));
  };

  const handleImport = async (file) => {
    setImportLoading(true);
    // Use dynamic import for xlsx to avoid install issues if not present
    let XLSX;
    try {
      XLSX = await import('xlsx');
    } catch (e) {
      message.error("Please run 'npm install xlsx' to enable this feature.");
      setImportLoading(false);
      return false;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate and Transform
        const transformedProducts = [];
        const errors = [];

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          const categoryName = row['Category']?.trim();
          if (!categoryName) {
            errors.push(`Row ${i + 2}: Category is missing`);
            continue;
          }

          const category = categories.find(c => c.name.trim().toLowerCase() === categoryName.toString().toLowerCase());
          if (!category) {
            errors.push(`Row ${i + 2}: Category '${categoryName}' not found`);
            continue;
          }

          transformedProducts.push({
            name: row['Name'],
            price: row['Price'],
            image: row['Image URL'] || row['Image'], // Handle both cases
            description: row['Description'],
            quantity: row['Quantity'],
            factory: row['Brand'] || row['Factory'],
            target: row['Target'],
            categoryId: category.id,
            categoryName: category.name // For display purposes
          });
        }

        if (errors.length > 0) {
          Modal.error({
            title: 'Validation Errors',
            content: (
              <div style={{ maxHeight: 400, overflow: 'auto' }}>
                {errors.map((err, idx) => <div key={idx}>{err}</div>)}
              </div>
            )
          });
          setImportLoading(false);
          return;
        }

        if (transformedProducts.length === 0) {
          message.warning("No valid products found in file");
          setImportLoading(false);
          return;
        }

        setImportData(transformedProducts);
      } catch (error) {
        console.error(error);
        message.error("Failed to parse file");
      } finally {
        setImportLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
    return false; // Prevent upload default behavior
  };

  const submitImport = async () => {
    setImportLoading(true);
    try {
      await productService.bulkCreateJSON(importData);
      message.success(`Successfully imported ${importData.length} products`);
      setImportModalVisible(false);
      setImportData([]);
      fetchProducts(1, pagination.pageSize);
    } catch (error) {
      console.error(error);
      message.error("Failed to import products");
    } finally {
      setImportLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await productService.downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error);
      message.error('Failed to download template');
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <Image
          width={60}
          height={60}
          src={image}
          alt="product"
          style={{ objectFit: 'cover', borderRadius: '8px' }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsZqBg+IkQAi4eNcY2FQ+gfQO8nX3GwQcbgx1j+BmFUpA4nXwDxKzToYG4ib/2//9nYGBgO8T8//9+4///v4sB3d9vGjD8HwD3FgLefG8sYgAAAAlwSFlzAAALEgAACxIB0t1+/AAAADh0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAADUlEQVQ4jWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Typography.Text strong style={{ color: '#111827' }}>{text}</Typography.Text>
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <Typography.Text strong>{formatPrice(price)}</Typography.Text>,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (q) => formatQuantity(q),
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'category',
      render: (name) => name || '',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => { setViewingProduct(record); setDetailModalVisible(true); }}
            style={{ borderRadius: '8px' }}
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ borderRadius: '8px' }}
          >
            Sửa
          </Button>
          <Button
            type="dashed"
            onClick={() => {
              if (!record.sizes && !record.colors) {
                message.warning("Vui lòng cấu hình Kích cỡ hoặc Màu sắc cho sản phẩm trước!");
              } else {
                handleManageVariants(record);
              }
            }}
            style={{ borderRadius: '8px' }}
          >
            Biến thể
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} style={{ borderRadius: '8px' }}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} bodyStyle={{ padding: 0 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#111827' }}>Quản lý sản phẩm</Title>
          <Input.Search
            placeholder="Tìm kiếm theo tên sản phẩm"
            allowClear
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            onSearch={handleSearch}
            style={{ width: 280, marginLeft: 'auto', marginRight: 16 }}
          />
          <Space>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`Bạn có chắc muốn xóa ${selectedRowKeys.length} mục đã chọn?`}
                onConfirm={handleBulkDelete}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button danger icon={<DeleteOutlined />} style={{ borderRadius: '8px' }}>
                  Xóa đã chọn ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadTemplate}
              style={{ borderRadius: '8px' }}
            >
              Tải biểu mẫu
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={() => {
                setImportData([]);
                setImportModalVisible(true);
              }}
              style={{ borderRadius: '8px' }}
            >
              Nhập Excel
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ backgroundColor: '#4F46E5', borderRadius: '8px' }}
            >
              Thêm sản phẩm
            </Button>
          </Space>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={products}
          loading={loading}
          rowKey="id"
          className="premium-table"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} mục`,
            style: { padding: '0 24px 24px 24px' }
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700 }}>{editingProduct ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        styles={{
          header: {
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={<span style={{ fontWeight: 500 }}>Tên sản phẩm</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <Input placeholder="Nhập tên sản phẩm" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label={<span style={{ fontWeight: 500 }}>Danh mục</span>}
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn danh mục" showSearch size="large" style={{ borderRadius: '8px' }}>
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label={<span style={{ fontWeight: 500 }}>Giá (VNĐ)</span>}
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%', borderRadius: '8px' }}
                  size="large"
                  placeholder="0"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label={<span style={{ fontWeight: 500 }}>Số lượng tồn kho</span>}
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%', borderRadius: '8px' }}
                  size="large"
                  placeholder="0"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sizes"
                label={<span style={{ fontWeight: 500 }}>Kích cỡ (Sizes)</span>}
                help="Nhập các kích cỡ và nhấn Enter (Ví dụ: S, M, L)"
              >
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Nhập các kích cỡ"
                  size="large"
                  tokenSeparators={[',']}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="colors"
                label={<span style={{ fontWeight: 500 }}>Màu sắc (Colors)</span>}
                help="Nhập các màu sắc và nhấn Enter (Ví dụ: Đen, Trắng)"
              >
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Nhập các màu sắc"
                  size="large"
                  tokenSeparators={[',']}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.colors !== currentValues.colors}>
            {({ getFieldValue }) => {
              const colors = getFieldValue('colors') || [];
              if (colors.length === 0) return null;
              
              return (
                <Card 
                  size="small" 
                  title={<span style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>Bộ sưu tập ảnh (Ảnh đại diện cho từng màu sắc)</span>} 
                  style={{ marginBottom: 24, borderRadius: '12px', border: '1px dashed #D1D5DB', backgroundColor: '#FAFAFA' }}
                >
                  <Row gutter={[16, 16]}>
                    {colors.map((color, index) => {
                      const fieldName = `colorImage_${index}`;
                      return (
                        <Col span={12} key={index}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <Form.Item
                              name={fieldName}
                              label={<span style={{ fontWeight: 500 }}>Ảnh cho màu: <Typography.Text type="danger" strong>{color}</Typography.Text></span>}
                              style={{ marginBottom: 8, flex: 1 }}
                            >
                              <Input 
                                placeholder="Nhập URL hình ảnh..." 
                                style={{ borderRadius: '8px' }}
                                suffix={
                                  <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                      const url = getFieldValue(fieldName);
                                      return url ? (
                                        <Image
                                          src={url}
                                          alt={color}
                                          width={24}
                                          height={24}
                                          style={{ objectFit: 'cover', borderRadius: '4px', border: '1px solid #E5E7EB' }}
                                          preview={{ mask: null }}
                                        />
                                      ) : null;
                                    }}
                                  </Form.Item>
                                }
                              />
                            </Form.Item>
                            <div style={{ paddingTop: '29px' }}>
                              <Upload
                                accept="image/*"
                                showUploadList={false}
                                beforeUpload={async (file) => {
                                  try {
                                    message.loading({ content: 'Đang tải ảnh lên...', key: `upload-${index}` });
                                    const result = await productService.uploadImage(file);
                                    const uploadedUrl = result.data || result;
                                    form.setFieldsValue({
                                      [fieldName]: uploadedUrl
                                    });
                                    message.success({ content: 'Tải ảnh lên thành công!', key: `upload-${index}` });
                                  } catch (err) {
                                    message.error({ content: 'Tải ảnh lên thất bại!', key: `upload-${index}` });
                                  }
                                  return false;
                                }}
                              >
                                <Button icon={<UploadOutlined />} style={{ borderRadius: '8px' }}>
                                  Tải lên
                                </Button>
                              </Upload>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </Card>
              );
            }}
          </Form.Item>

          {/* Main Product Image */}
          <Card 
            size="small" 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PictureOutlined style={{ color: '#4F46E5', fontSize: '16px' }} />
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>
                  Hình ảnh đại diện sản phẩm (Ảnh chính)
                </span>
              </div>
            } 
            style={{ marginBottom: 24, borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#FAFAFA' }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={16}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Form.Item
                    name="image"
                    label={<span style={{ fontWeight: 500 }}>Đường dẫn ảnh (URL) hoặc tải ảnh lên</span>}
                    style={{ marginBottom: 8, flex: 1 }}
                    help="Dán URL ảnh hoặc nhấn nút 'Tải lên' để chọn file ảnh từ thiết bị"
                  >
                    <Input 
                      placeholder="https://images.unsplash.com/... hoặc dán link ảnh" 
                      size="large"
                      allowClear
                      prefix={<LinkOutlined style={{ color: '#9CA3AF' }} />}
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                  <div style={{ paddingTop: '29px' }}>
                    <Upload
                      accept="image/*"
                      showUploadList={false}
                      beforeUpload={async (file) => {
                        try {
                          message.loading({ content: 'Đang tải ảnh đại diện lên...', key: 'upload-main-img' });
                          const result = await productService.uploadImage(file);
                          const uploadedUrl = result.data || result;
                          form.setFieldsValue({
                            image: uploadedUrl
                          });
                          message.success({ content: 'Tải ảnh đại diện thành công!', key: 'upload-main-img' });
                        } catch (err) {
                          message.error({ content: 'Tải ảnh lên thất bại!', key: 'upload-main-img' });
                        }
                        return false;
                      }}
                    >
                      <Button icon={<UploadOutlined />} size="large" type="dashed" style={{ borderRadius: '8px', borderColor: '#4F46E5', color: '#4F46E5', fontWeight: 500 }}>
                        Tải lên
                      </Button>
                    </Upload>
                  </div>
                </div>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.image !== currentValues.image}>
                  {({ getFieldValue }) => {
                    const imgUrl = getFieldValue('image') || (editingProduct ? editingProduct.image : null);
                    return (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px dashed #D1D5DB',
                        minHeight: '115px'
                      }}>
                        {imgUrl ? (
                          <div style={{ textAlign: 'center' }}>
                            <Image
                              src={imgUrl}
                              alt="Ảnh đại diện"
                              height={85}
                              style={{ objectFit: 'contain', borderRadius: '6px', maxWidth: '100%' }}
                              fallback="https://via.placeholder.com/85?text=Ảnh+lỗi"
                            />
                            <div style={{ marginTop: '4px', fontSize: '11px', color: '#6B7280' }}>
                              Xem trước ảnh chính
                            </div>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '12px' }}>
                            <PictureOutlined style={{ fontSize: '26px', marginBottom: '4px', color: '#D1D5DB' }} />
                            <div>Chưa có ảnh đại diện</div>
                          </div>
                        )}
                      </div>
                    );
                  }}
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="factory"
                label={<span style={{ fontWeight: 500 }}>Hãng (Brand)</span>}
                rules={[{ required: true, message: 'Vui lòng chọn hãng!' }]}
              >
                <Select placeholder="Chọn hãng" showSearch size="large" style={{ borderRadius: '8px' }}>
                  {brands.map(brand => (
                    <Option key={brand.id} value={brand.name}>
                      {brand.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="target"
                label={<span style={{ fontWeight: 500 }}>Đối tượng</span>}
                rules={[{ required: true, message: 'Vui lòng chọn đối tượng!' }]}
              >
                <Select placeholder="Chọn đối tượng" showSearch size="large" style={{ borderRadius: '8px' }}>
                  {targets.map(target => (
                    <Option key={target.id} value={target.name}>
                      {target.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={<span style={{ fontWeight: 500 }}>Mô tả</span>}
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả sản phẩm..."
              showCount
              maxLength={500}
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)} size="large" style={{ borderRadius: '8px' }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" size="large" loading={submitLoading} style={{ backgroundColor: '#4F46E5', borderRadius: '8px' }}>
                {editingProduct ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={importData.length > 0 ? <span style={{ fontWeight: 700 }}>Xem trước dữ liệu nhập ({importData.length} sản phẩm)</span> : <span style={{ fontWeight: 700 }}>Nhập dữ liệu từ Excel</span>}
        open={importModalVisible}
        onCancel={() => {
          setImportModalVisible(false);
          setImportData([]);
        }}
        width={importData.length > 0 ? 1000 : 520}
        footer={importData.length > 0 ? (
          <Space>
            <Button onClick={() => setImportData([])} style={{ borderRadius: '8px' }}>Quay lại</Button>
            <Button type="primary" onClick={submitImport} loading={importLoading} style={{ backgroundColor: '#4F46E5', borderRadius: '8px' }}>
              Xác nhận nhập
            </Button>
          </Space>
        ) : null}
      >
        {importData.length > 0 ? (
          <Table
            dataSource={importData}
            rowKey={(record, index) => index}
            pagination={{ pageSize: 5 }}
            size="small"
            className="premium-table"
            columns={[
              { title: 'Tên sản phẩm', dataIndex: 'name' },
              { title: 'Danh mục', dataIndex: 'categoryName' },
              { title: 'Giá', dataIndex: 'price', render: (val) => formatPrice(val) },
              { title: 'SL', dataIndex: 'quantity' },
              { title: 'Hãng', dataIndex: 'factory' }
            ]}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: '#6B7280', marginBottom: 16 }}>Vui lòng tải biểu mẫu trước để đảm bảo đúng định dạng.</p>
            <Button
              onClick={handleDownloadTemplate}
              icon={<UploadOutlined rotate={180} />}
              style={{ marginBottom: 20, borderRadius: '8px' }}
            >
              Tải biểu mẫu
            </Button>

            <Upload.Dragger
              name="file"
              multiple={false}
              accept=".xlsx, .xls"
              beforeUpload={handleImport}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ color: '#4F46E5' }} />
              </p>
              <p className="ant-upload-text" style={{ fontWeight: 600 }}>Nhấp hoặc kéo thả tệp vào đây để tải lên</p>
              <p className="ant-upload-hint" style={{ color: '#9CA3AF' }}>
                Chỉ hỗ trợ tải lên tệp định dạng Excel.
              </p>
            </Upload.Dragger>
            {importLoading && <p style={{ marginTop: 10 }}>Đang phân tích...</p>}
          </div>
        )}
      </Modal>

      <Modal
        title={<span style={{ fontWeight: 700 }}>Chi tiết sản phẩm</span>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailModalVisible(false)} style={{ borderRadius: '8px', backgroundColor: '#4F46E5', border: 'none' }}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {viewingProduct && (
          <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
            <Col span={8}>
              <div style={{ textAlign: 'center', backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '12px' }}>
                <Image
                  src={viewingProduct.image}
                  alt={viewingProduct.name}
                  style={{ maxHeight: '200px', objectFit: 'contain', width: '100%', borderRadius: '8px' }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsZqBg+IkQAi4eNcY2FQ+gfQO8nX3GwQcbgx1j+BmFUpA4nXwDxKzToYG4ib/2//9nYGBgO8T8//9+4///v4sB3d9vGjD8HwD3FgLefG8sYgAAAAlwSFlzAAALEgAACxIB0t1+/AAAADh0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAADUlEQVQ4jWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="
                />
              </div>
            </Col>
            <Col span={16}>
              <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{ fontWeight: 600, width: '130px', backgroundColor: '#F9FAFB' }}
                contentStyle={{ backgroundColor: '#fff' }}
              >
                <Descriptions.Item label="Sản phẩm">
                  <Typography.Text strong style={{ fontSize: '16px' }}>{viewingProduct.name}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Mức giá">
                  <span style={{ color: '#EF4444', fontWeight: 'bold' }}>{formatPrice(viewingProduct.price)}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Tồn kho">
                  <Badge
                    status={viewingProduct.quantity > 0 ? "success" : "error"}
                    text={viewingProduct.quantity > 0 ? `${formatQuantity(viewingProduct.quantity)} sản phẩm` : "Hết hàng"}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Danh mục">
                  {viewingProduct.categoryName || 'Không có'}
                </Descriptions.Item>
                <Descriptions.Item label="Hãng">
                  {viewingProduct.factory || 'Không có'}
                </Descriptions.Item>
                <Descriptions.Item label="Đối tượng">
                  {viewingProduct.target || 'Không có'}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                  <div style={{ whiteSpace: 'pre-wrap', maxHeight: '150px', overflowY: 'auto' }}>
                    {viewingProduct.description || 'Chưa có mô tả'}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        )}
      </Modal>

      <Modal
        title={<span style={{ fontWeight: 700 }}>Quản lý tồn kho biến thể - {variantsProduct?.name}</span>}
        open={variantsModalVisible}
        onCancel={() => setVariantsModalVisible(false)}
        width={650}
        confirmLoading={variantsLoading}
        onOk={handleSaveVariants}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        styles={{
          header: {
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16
          }
        }}
      >
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <Typography.Paragraph type="secondary">
            Thiết lập số lượng tồn kho riêng biệt cho từng biến thể cụ thể (Size + Màu sắc). 
            Tổng số lượng tồn kho của sản phẩm sẽ tự động cập nhật bằng tổng các biến thể này sau khi nhấn **Lưu thay đổi**.
          </Typography.Paragraph>
        </div>
        <Table
          dataSource={variantsList}
          rowKey="key"
          loading={variantsLoading}
          pagination={false}
          size="middle"
          className="premium-table"
          columns={[
            {
              title: 'Hình ảnh',
              key: 'image',
              render: (_, record) => {
                let variantImage = variantsProduct?.image;
                if (record.color && variantsProduct?.colors && variantsProduct?.images) {
                  const colorList = variantsProduct.colors.split(',').map(x => x.trim()).filter(Boolean);
                  const imageList = variantsProduct.images.split(',').map(x => x.trim()).filter(Boolean);
                  const colorIndex = colorList.indexOf(record.color);
                  if (colorIndex !== -1 && imageList[colorIndex]) {
                    variantImage = imageList[colorIndex];
                  }
                }
                return (
                  <Image
                    width={40}
                    height={40}
                    src={variantImage || 'https://via.placeholder.com/40x40?text=No+Img'}
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                  />
                );
              }
            },
            {
              title: 'Kích cỡ (Size)',
              dataIndex: 'size',
              key: 'size',
              render: (text) => text || <Typography.Text type="secondary" italic>Không có</Typography.Text>
            },
            {
              title: 'Màu sắc (Color)',
              dataIndex: 'color',
              key: 'color',
              render: (text) => text || <Typography.Text type="secondary" italic>Không có</Typography.Text>
            },
            {
              title: 'Số lượng tồn kho',
              dataIndex: 'quantity',
              key: 'quantity',
              render: (value, record) => (
                <InputNumber
                  min={0}
                  value={value}
                  onChange={(val) => updateVariantQty(record.key, val)}
                  style={{ width: '150px', borderRadius: '8px' }}
                />
              )
            }
          ]}
        />
      </Modal>
    </div>
  );
};

export default Products;
