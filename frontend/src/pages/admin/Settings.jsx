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
      <Title level={2}>System Settings</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card title="Appearance" icon={<BgColorsOutlined />}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Text strong>Theme Mode:</Text>
              <Radio.Group
                value={themeMode}
                onChange={(e) => {
                  setThemeMode(e.target.value);
                  message.success(`Theme switched to ${e.target.value} mode`);
                }}
                buttonStyle="solid"
              >
                <Radio.Button value="light">Light</Radio.Button>
                <Radio.Button value="dark">Dark</Radio.Button>
                <Radio.Button value="system">System</Radio.Button>
              </Radio.Group>
              <Text type="secondary" style={{ marginLeft: '8px' }}>
                {themeMode === 'system' && '(Follows your operating system preference)'}
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="General Settings" icon={<GlobalOutlined />}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{
                siteName: 'Sunny Shop',
                siteDescription: 'Your trusted sunny shop store',
                maintenanceMode: false,
                allowRegistration: true,
                defaultCurrency: 'USD'
              }}
            >
              <Form.Item
                name="siteName"
                label="Site Name"
                rules={[{ required: true, message: 'Please input site name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="siteDescription"
                label="Site Description"
              >
                <TextArea rows={3} />
              </Form.Item>

              <Form.Item
                name="defaultCurrency"
                label="Default Currency"
              >
                <Select>
                  <Option value="USD">USD - US Dollar</Option>
                  <Option value="EUR">EUR - Euro</Option>
                  <Option value="VND">VND - Vietnamese Dong</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="maintenanceMode"
                label="Maintenance Mode"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="allowRegistration"
                label="Allow User Registration"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Email Settings" icon={<MailOutlined />}>
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
                label="SMTP Host"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="smtpPort"
                label="SMTP Port"
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                name="smtpUsername"
                label="SMTP Username"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="smtpPassword"
                label="SMTP Password"
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="fromEmail"
                label="From Email"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="fromName"
                label="From Name"
              >
                <Input />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Security Settings" icon={<SecurityScanOutlined />}>
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
                label="Session Timeout (minutes)"
              >
                <Input type="number" min={5} max={1440} />
              </Form.Item>

              <Form.Item
                name="maxLoginAttempts"
                label="Max Login Attempts"
              >
                <Input type="number" min={3} max={10} />
              </Form.Item>

              <Form.Item
                name="passwordMinLength"
                label="Minimum Password Length"
              >
                <Input type="number" min={6} max={32} />
              </Form.Item>

              <Form.Item
                name="requireTwoFactor"
                label="Require Two-Factor Authentication"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableAuditLog"
                label="Enable Audit Logging"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Notification Settings">
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
                label="Enable Email Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="orderNotifications"
                label="Order Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="userNotifications"
                label="User Registration Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="systemNotifications"
                label="System Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider />

              <Form.Item
                name="lowStockAlert"
                label="Low Stock Alert"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="stockThreshold"
                label="Stock Threshold"
              >
                <Input type="number" min={1} max={100} />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Space>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            loading={loading}
            size="large"
          >
            Save All Settings
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
            size="large"
          >
            Reset to Default
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Settings;
