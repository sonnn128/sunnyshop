import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Form, Input, Button, Row, Col, Avatar, message, Upload } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext.jsx';
import api from '@/config/api.js';
import { fileService } from '@/services/file.service';

const { Title } = Typography;

const ProfilePage = () => {
    const { user } = useAuth();
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            setAvatarUrl(user.avatar || '');
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar
            });
        }
    }, [user, form]);

    const handleUpload = async ({ file, onSuccess, onError }) => {
        try {
            const response = await fileService.upload(file);
            console.log("Upload response:", response);
            // Check if response is just the string URL or an object with data property
            // Based on FileController, it returns ApiResponse with data field
            const url = response.data || response;

            setAvatarUrl(url);
            onSuccess(url);
            message.success('Avatar uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            onError(error);
            message.error('Failed to upload avatar');
        }
    };

    const onFinishProfile = async (values) => {
        setLoadingProfile(true);
        try {
            const updateData = {
                ...values,
                avatar: avatarUrl
            };
            const res = await api.put('/auth/profile', updateData);
            message.success('Profile updated');

            const updatedUser = res.data.data || res.data;
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Reload to reflect changes in layout/navbar if needed
            window.location.reload();
        } catch (e) {
            console.error(e);
            message.error('Unable to update profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    const onChangePassword = async (vals) => {
        setLoadingPassword(true);
        try {
            await api.post('/auth/change-password', { oldPassword: vals.oldPassword, newPassword: vals.newPassword });
            message.success('Password changed');
        } catch (e) {
            message.error('Unable to change password');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div>
            <Title level={2}>My Profile</Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ marginBottom: 16 }}>
                                {avatarUrl ? (
                                    <Avatar size={100} src={avatarUrl} />
                                ) : (
                                    <Avatar size={100} icon={<UserOutlined />} />
                                )}
                            </div>
                            <Upload
                                customRequest={handleUpload}
                                showUploadList={false}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />}>Change Avatar</Button>
                            </Upload>
                            <Title level={4} style={{ marginTop: 16 }}>{user?.fullName || 'User'}</Title>
                            <p>{user?.email || 'user@example.com'}</p>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card title="Edit Profile">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinishProfile}
                        >
                            <Form.Item name="avatar" hidden>
                                <Input />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="phone" label="Phone">
                                <Input />
                            </Form.Item>

                            <Form.Item name="address" label="Address">
                                <Input.TextArea rows={2} />
                            </Form.Item>

                            <Form.Item label="Address Book">
                                <Link to="/profile/addresses">
                                    <Button type="dashed" icon={<UserOutlined />}>Manage Address Book</Button>
                                </Link>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loadingProfile}>Update Profile</Button>
                            </Form.Item>
                        </Form>

                        <div style={{ marginTop: 24 }}>
                            <Card title="Change password">
                                <Form onFinish={onChangePassword}>
                                    <Form.Item name="oldPassword" rules={[{ required: true }]}>
                                        <Input.Password placeholder="Old password" />
                                    </Form.Item>
                                    <Form.Item name="newPassword" rules={[{ required: true, min: 6 }]}>
                                        <Input.Password placeholder="New password" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button htmlType="submit" type="primary" loading={loadingPassword}>Change password</Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;
