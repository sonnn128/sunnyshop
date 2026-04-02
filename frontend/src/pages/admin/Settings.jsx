import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  message,
  Typography,
  Row,
  Col,
  Divider,
  Space
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined,
  MailOutlined,
  GlobalOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
import { useTheme } from '@/contexts/ThemeContext.jsx';
import { Radio } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { themeMode, setThemeMode } = useTheme();

  const handleSave = async (values) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info('Settings reset to default values');
  };

  return (
    <div>
      <Title level={3} style={{ fontWeight: 700, color: '#111827', marginBottom: 24 }}>Cài đặt hệ thống</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card title="Giao diện" icon={<BgColorsOutlined />} style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Text strong>Chế độ giao diện:</Text>
              <Radio.Group
                value={themeMode}
                onChange={(e) => {
                  setThemeMode(e.target.value);
                  message.success(`Đã chuyển giao diện sang chế độ ${e.target.value}`);
                }}
                buttonStyle="solid"
              >
                <Radio.Button value="light" style={{ borderRadius: '8px 0 0 8px' }}>Sáng</Radio.Button>
                <Radio.Button value="dark">Tối</Radio.Button>
                <Radio.Button value="system" style={{ borderRadius: '0 8px 8px 0' }}>Hệ thống</Radio.Button>
              </Radio.Group>
              <Text type="secondary" style={{ marginLeft: '8px' }}>
                {themeMode === 'system' && '(Theo cài đặt giao diện của hệ điều hành)'}
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Cài đặt chung" icon={<GlobalOutlined />} style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{
                siteName: 'Sunny Shop',
                siteDescription: 'Your trusted sunny shop store',
                maintenanceMode: false,
                allowRegistration: true,
                defaultCurrency: 'VND'
              }}
            >
              <Form.Item
                name="siteName"
                label={<span style={{ fontWeight: 500 }}>Tên trang web</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên trang web!' }]}
              >
                <Input size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="siteDescription"
                label={<span style={{ fontWeight: 500 }}>Mô tả trang web</span>}
              >
                <TextArea rows={3} style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="defaultCurrency"
                label={<span style={{ fontWeight: 500 }}>Tiền tệ mặc định</span>}
              >
                <Select size="large" style={{ borderRadius: '8px' }}>
                  <Option value="USD">USD - Đô la Mỹ</Option>
                  <Option value="EUR">EUR - Euro</Option>
                  <Option value="VND">VND - Việt Nam Đồng</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="maintenanceMode"
                label={<span style={{ fontWeight: 500 }}>Chế độ bảo trì</span>}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="allowRegistration"
                label={<span style={{ fontWeight: 500 }}>Cho phép đăng ký tài khoản mới</span>}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Cài đặt Email (SMTP)" icon={<MailOutlined />} style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', height: '100%' }}>
            <Form
              layout="vertical"
              initialValues={{
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                smtpUsername: 'admin@sunnyshop.com',
                smtpPassword: '********',
                fromEmail: 'noreply@sunnyshop.com',
                fromName: 'Sunny Shop'
              }}
            >
              <Form.Item
                name="smtpHost"
                label={<span style={{ fontWeight: 500 }}>Máy chủ SMTP</span>}
              >
                <Input size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="smtpPort"
                label={<span style={{ fontWeight: 500 }}>Cổng SMTP</span>}
              >
                <Input type="number" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="smtpUsername"
                label={<span style={{ fontWeight: 500 }}>Tài khoản SMTP</span>}
              >
                <Input size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="smtpPassword"
                label={<span style={{ fontWeight: 500 }}>Mật khẩu SMTP</span>}
              >
                <Input.Password size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="fromEmail"
                label={<span style={{ fontWeight: 500 }}>Email Người gửi</span>}
              >
                <Input size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="fromName"
                label={<span style={{ fontWeight: 500 }}>Tên hiển thị người gửi</span>}
              >
                <Input size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Cài đặt Bảo mật" icon={<SecurityScanOutlined />} style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', height: '100%' }}>
            <Form
              layout="vertical"
              initialValues={{
                sessionTimeout: 30,
                maxLoginAttempts: 5,
                passwordMinLength: 8,
                requireTwoFactor: false,
                enableAuditLog: true
              }}
            >
              <Form.Item
                name="sessionTimeout"
                label={<span style={{ fontWeight: 500 }}>Thời gian hết hạn phiên (Phút)</span>}
              >
                <Input type="number" min={5} max={1440} size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="maxLoginAttempts"
                label={<span style={{ fontWeight: 500 }}>Số lần đăng nhập sai tối đa</span>}
              >
                <Input type="number" min={3} max={10} size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="passwordMinLength"
                label={<span style={{ fontWeight: 500 }}>Độ dài mật khẩu tối thiểu</span>}
              >
                <Input type="number" min={6} max={32} size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="requireTwoFactor"
                label={<span style={{ fontWeight: 500 }}>Yêu cầu xác thực hai bước (2FA)</span>}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableAuditLog"
                label={<span style={{ fontWeight: 500 }}>Bật ghi chú truy cập (Audit Log)</span>}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Cài đặt thông báo" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', height: '100%' }}>
            <Form
              layout="vertical"
              initialValues={{
                emailNotifications: true,
                orderNotifications: true,
                userNotifications: true,
                systemNotifications: false,
                lowStockAlert: true,
                stockThreshold: 10
              }}
            >
              <Form.Item
                name="emailNotifications"
                label={<span style={{ fontWeight: 500 }}>Bật thông báo qua Email</span>}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="orderNotifications"
                label={<span style={{ fontWeight: 500 }}>Thông báo khi có đơn hàng mới</span>}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="userNotifications"
                label={<span style={{ fontWeight: 500 }}>Thông báo khi có người dùng đăng ký</span>}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="systemNotifications"
                label={<span style={{ fontWeight: 500 }}>Thông báo hệ thống</span>}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider style={{ margin: '24px 0' }} />

              <Form.Item
                name="lowStockAlert"
                label={<span style={{ fontWeight: 500 }}>Cảnh báo sắp hết hàng</span>}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="stockThreshold"
                label={<span style={{ fontWeight: 500 }}>Ngưỡng số lượng cảnh báo hết hàng</span>}
              >
                <Input type="number" min={1} max={100} size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24, borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <Space>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            loading={loading}
            size="large"
            style={{ backgroundColor: '#4F46E5', borderRadius: '8px' }}
          >
            Lưu tất cả thay đổi
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
            size="large"
            style={{ borderRadius: '8px' }}
          >
            Khôi phục mặc định
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Settings;
