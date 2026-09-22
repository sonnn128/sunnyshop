import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Form, Input, Button, Row, Col, Avatar, message, Upload, Select } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext.jsx';
import api from '@/config/api.js';
import { fileService } from '@/services/file.service';

const { Title } = Typography;

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
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
                avatar: user.avatar,
                gender: user.gender
            });
        }
    }, [user, form]);

    const handleUpload = async ({ file, onSuccess, onError }) => {
        try {
            setLoadingAvatar(true);
            const response = await fileService.upload(file);
            const url = response.data || response;

            setAvatarUrl(url);
            form.setFieldValue('avatar', url);
            updateUser({ ...user, avatar: url });
            onSuccess(url);
            message.success('Đã tải ảnh đại diện lên thành công');
        } catch (error) {
            console.error('Upload error:', error);
            onError(error);
            message.error(error.response?.data?.message || 'Không thể tải ảnh đại diện lên');
        } finally {
            setLoadingAvatar(false);
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
            message.success('Đã cập nhật hồ sơ thành công');

            const updatedUser = res.data?.data || res.data;
            updateUser(updatedUser);
        } catch (e) {
            console.error(e);
            message.error(e.response?.data?.message || 'Không thể cập nhật hồ sơ');
        } finally {
            setLoadingProfile(false);
        }
    };

    const onChangePassword = async (vals) => {
        setLoadingPassword(true);
        try {
            await api.post('/auth/change-password', { oldPassword: vals.oldPassword, newPassword: vals.newPassword });
            message.success('Đã đổi mật khẩu thành công');
        } catch (e) {
            message.error(e.response?.data?.message || 'Không thể đổi mật khẩu');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div>
            <Title level={2}>Hồ sơ của tôi</Title>

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
                                disabled={loadingAvatar}
                            >
                                <Button icon={<UploadOutlined />} loading={loadingAvatar}>Đổi ảnh đại diện</Button>
                            </Upload>
                            <Title level={4} style={{ marginTop: 16 }}>{user?.fullName || 'Người dùng'}</Title>
                            <p>{user?.email || 'user@example.com'}</p>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card title="Chỉnh sửa hồ sơ">
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
                                    <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true }]}>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
                                        <Input placeholder="Nhập họ và tên" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="gender" label="Giới tính">
                                        <Select
                                            placeholder="Chọn giới tính"
                                            allowClear
                                            options={[
                                                { value: 'MALE', label: 'Nam' },
                                                { value: 'FEMALE', label: 'Nữ' },
                                                { value: 'OTHER', label: 'Khác' }
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="phone" label="Số điện thoại">
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            <Form.Item name="address" label="Địa chỉ">
                                <Input.TextArea rows={2} placeholder="Nhập địa chỉ" />
                            </Form.Item>

                            <Form.Item label="Sổ địa chỉ">
                                <Link to="/profile/addresses">
                                    <Button type="dashed" icon={<UserOutlined />}>Quản lý sổ địa chỉ</Button>
                                </Link>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loadingProfile}>Cập nhật hồ sơ</Button>
                            </Form.Item>
                        </Form>

                        <div style={{ marginTop: 24 }}>
                            <Card title="Đổi mật khẩu">
                                <Form onFinish={onChangePassword}>
                                    <Form.Item name="oldPassword" rules={[{ required: true }]}>
                                        <Input.Password placeholder="Mật khẩu cũ" />
                                    </Form.Item>
                                    <Form.Item name="newPassword" rules={[{ required: true, min: 6 }]}>
                                        <Input.Password placeholder="Mật khẩu mới" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button htmlType="submit" type="primary" loading={loadingPassword}>Đổi mật khẩu</Button>
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
