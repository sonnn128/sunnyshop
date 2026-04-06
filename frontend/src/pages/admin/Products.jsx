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
  EyeOutlined
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

  const fetchProducts = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await productService.getAll({
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
    form.setFieldsValue(record);
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

      // Create product object (without the file)
      const productData = {
        name: values.name,
        price: values.price,
        quantity: values.quantity,
        factory: values.factory,
        target: values.target,
        description: values.description,
        categoryId: values.categoryId,
        image: values.image
      };

      if (editingProduct && !imageFile) {
        productData.image = editingProduct.image;
      }

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
          const categoryName = row['Category'];
          if (!categoryName) {
            errors.push(`Row ${i + 2}: Category is missing`);
            continue;
          }

          const category = categories.find(c => c.name.toLowerCase() === categoryName.toString().toLowerCase());
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

          <Form.Item
            name="imageFile"
            label={<span style={{ fontWeight: 500 }}>Hình ảnh sản phẩm</span>}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} size="large" style={{ borderRadius: '8px' }}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          {editingProduct && editingProduct.image && (
            <div style={{ marginBottom: 24 }}>
              <Typography.Text type="secondary">Ảnh hiện tại:</Typography.Text>
              <br />
              <Image
                width={100}
                src={editingProduct.image}
                style={{ marginTop: 8, borderRadius: '8px' }}
              />
            </div>
          )}

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
    </div>
  );
};

export default Products;
