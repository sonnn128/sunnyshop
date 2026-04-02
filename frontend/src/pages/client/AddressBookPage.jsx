import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Row, Col, Modal, Form, Input, Tag, Space, Popconfirm, message, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StarOutlined } from '@ant-design/icons';
import addressService from '../../services/address.service';

const { Title, Text } = Typography;

const AddressBookPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await addressService.getAll();
            const data = response.data || response;
            setAddresses(Array.isArray(data) ? data : []);
        } catch (error) {
            message.error('Failed to fetch addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingAddress(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (addr) => {
        setEditingAddress(addr);
        form.setFieldsValue(addr);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await addressService.delete(id);
            message.success('Address deleted');
            fetchAddresses();
        } catch (error) {
            message.error('Failed to delete address');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await addressService.setDefault(id);
            message.success('Set as default address');
            fetchAddresses();
        } catch (error) {
            message.error('Failed to set default address');
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editingAddress) {
                await addressService.update(editingAddress.id, values);
                message.success('Address updated');
            } else {
                await addressService.create(values);
                message.success('Address created');
            }
            setModalVisible(false);
            fetchAddresses();
        } catch (error) {
            message.error('Failed to save address');
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>My Address Book</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add New Address
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                {addresses.map(addr => (
                    <Col xs={24} md={12} lg={8} key={addr.id}>
                        <Card
                            hoverable
                            actions={[
                                <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(addr)}>Edit</Button>,
                                <Popconfirm title="Delete this address?" onConfirm={() => handleDelete(addr.id)}>
                                    <Button type="text" danger icon={<DeleteOutlined />}>Delete</Button>
                                </Popconfirm>,
                                !addr.default && (
                                    <Button type="text" icon={<StarOutlined />} onClick={() => handleSetDefault(addr.id)}>Set Default</Button>
                                )
                            ]}
                            title={
                                <Space>
                                    {addr.receiverName}
                                    {addr.default && <Tag color="green">Default</Tag>}
                                </Space>
                            }
                        >
                            <div style={{ minHeight: 100 }}>
                                <p><strong>Phone:</strong> {addr.phone}</p>
                                <p>
                                    <strong>Address:</strong><br />
                                    {addr.street},<br />
                                    {addr.ward}, {addr.district},<br />
                                    {addr.city}
                                </p>
                            </div>
                        </Card>
                    </Col>
                ))}
                {addresses.length === 0 && !loading && (
                    <Col span={24}>
                        <Text type="secondary">No addresses found. Add one to get started.</Text>
                    </Col>
                )}
            </Row>

            <Modal
                title={editingAddress ? "Edit Address" : "Add New Address"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="receiverName"
                        label="Receiver Name"
                        rules={[{ required: true, message: 'Please input receiver name' }]}
                    >
                        <Input placeholder="John Doe" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please input phone number' }]}
                    >
                        <Input placeholder="0123456789" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="city"
                                label="City/Province"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Ho Chi Minh" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="district"
                                label="District"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="District 1" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="ward"
                                label="Ward"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Ben Nghe Ward" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="street"
                                label="Street Address"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="123 Le Loi Street" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="default"
                        valuePropName="checked"
                        label="Set as default address"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Save Address</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddressBookPage;
