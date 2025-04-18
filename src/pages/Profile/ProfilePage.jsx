import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Tabs,
    Form,
    Input,
    Button,
    Typography,
    Alert,
    message,
    Descriptions,
    Spin,
    Empty,
    Upload,
    Avatar,
    Row,
    Col,
    List,
    Modal // Added
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    UploadOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../features/store';
import styles from './ProfilePage.module.css';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ProfilePage = () => {
    const navigate = useNavigate();

    const isAuthenticated = useStore(state => state.isAuthenticated);
    const currentUser = useStore(state => state.currentUser);
    const updateProfile = useStore(state => state.updateProfile);
    const updatePassword = useStore(state => state.updatePassword);
    const favorites = useStore(state => state.favorites);
    const removeFromFavorites = useStore(state => state.removeFromFavorites);
    const deleteAccount = useStore(state => state.deleteAccount); // Added

    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profileError, setProfileError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const fillProfileForm = useCallback(() => {
        if (currentUser) {
            const { firstName, lastName, email } = currentUser;
            const currentValues = profileForm.getFieldsValue(true);

            if (
                currentValues.firstName !== firstName ||
                currentValues.lastName !== lastName ||
                currentValues.email !== email
            ) {
                profileForm.setFieldsValue({
                    firstName,
                    lastName,
                    email,
                });
            }
        }
    }, [currentUser, profileForm]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            fillProfileForm();
        }
    }, [isAuthenticated, navigate, fillProfileForm]);

    const handleAvatarUpload = async (options) => {
        const { file } = options;
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Вы можете загружать только JPG/PNG файлы!');
            return;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Изображение должно быть меньше 2MB!');
            return;
        }

        setUploading(true);
        try {
            const base64 = await getBase64(file);
            const result = updateProfile({ avatarUrl: base64 });
            if (result.success) {
                message.success('Аватар успешно обновлен!');
            } else {
                message.error(result.message || 'Не удалось обновить аватар.');
            }
        } catch (error) {
            message.error('Ошибка при загрузке файла.');
        } finally {
            setUploading(false);
        }
    };


    const onUpdateProfile = async (values) => {
        setProfileError(null);
        setLoadingProfile(true);
        try {
            const result = updateProfile({
                firstName: values.firstName,
                lastName: values.lastName,
            });
            if (result.success) {
                message.success('Профиль успешно обновлен!');
            } else {
                setProfileError(result.message || 'Ошибка обновления профиля.');
            }
        } catch (err) {
            setProfileError('Произошла ошибка. Попробуйте снова.');
        } finally {
            setLoadingProfile(false);
        }
    };

    const onChangePassword = async (values) => {
        setPasswordError(null);
        setLoadingPassword(true);
        try {
            const result = updatePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            });
            if (result.success) {
                message.success('Пароль успешно изменен!');
                passwordForm.resetFields();
            } else {
                setPasswordError(result.message || 'Ошибка смены пароля.');
            }
        } catch (err) {
            setPasswordError('Произошла ошибка. Попробуйте снова.');
        } finally {
            setLoadingPassword(false);
        }
    };

    const showDeleteConfirm = () => {
        confirm({
            title: 'Вы уверены, что хотите удалить свой аккаунт?',
            icon: <ExclamationCircleOutlined />,
            content: 'Это действие необратимо. Все ваши данные будут удалены.',
            okText: 'Удалить аккаунт',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk() {
                performDeleteAccount();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const performDeleteAccount = async () => {
        const result = deleteAccount();
        if (result.success) {
            message.success('Аккаунт успешно удален.');
            navigate('/'); // Redirect to home page after deletion
        } else {
            message.error(result.message || 'Ошибка при удалении аккаунта.');
        }
    };


    if (!isAuthenticated) {
        return <div style={{textAlign: 'center', marginTop: 50}}><Spin size="large" /></div>;
    }

    if (!currentUser) {
        return <Empty description="Не удалось загрузить данные пользователя."/>;
    }

    return (
        <div className={styles.profileContainer}>
            <Title level={2} style={{ marginBottom: '30px' }}>Мой профиль</Title>
            <Tabs defaultActiveKey="1" type="card">
                <TabPane tab="Основная информация" key="1">
                    <div className={styles.tabPaneContent}>
                        <Row gutter={32}>
                            <Col xs={24} sm={8} md={6} className={styles.avatarSection}>
                                <Avatar
                                    size={128}
                                    icon={<UserOutlined />}
                                    src={currentUser.avatarUrl}
                                />
                                <Upload
                                    name="avatar"
                                    customRequest={handleAvatarUpload}
                                    showUploadList={false}
                                    className={styles.avatarUploader}
                                >
                                    <Button icon={<UploadOutlined />} style={{marginTop: '15px'}} loading={uploading}>
                                        Сменить аватар
                                    </Button>
                                </Upload>
                            </Col>
                            <Col xs={24} sm={16} md={18}>
                                <Descriptions bordered column={1} size="small">
                                    <Descriptions.Item label="Имя">{currentUser.firstName}</Descriptions.Item>
                                    <Descriptions.Item label="Фамилия">{currentUser.lastName}</Descriptions.Item>
                                    <Descriptions.Item label="Email">{currentUser.email}</Descriptions.Item>
                                </Descriptions>

                                <Title level={4} style={{marginTop: 30}}>Редактировать информацию</Title>
                                {profileError && <Alert message={profileError} type="error" showIcon style={{ marginBottom: 15 }} closable onClose={() => setProfileError(null)}/>}
                                <Form
                                    form={profileForm}
                                    layout="vertical"
                                    onFinish={onUpdateProfile}
                                >
                                    <Form.Item
                                        name="firstName"
                                        label="Имя"
                                        rules={[{ required: true, message: 'Введите имя!', whitespace: true }]}
                                    >
                                        <Input prefix={<UserOutlined />} />
                                    </Form.Item>
                                    <Form.Item
                                        name="lastName"
                                        label="Фамилия"
                                        rules={[{ required: true, message: 'Введите фамилию!', whitespace: true }]}
                                    >
                                        <Input prefix={<UserOutlined />} />
                                    </Form.Item>
                                    <Form.Item
                                        name="email"
                                        label="Email (нельзя изменить)"
                                    >
                                        <Input prefix={<MailOutlined />} disabled />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={loadingProfile}>
                                            Сохранить изменения
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </TabPane>

                <TabPane tab="Смена пароля" key="2">
                    <div className={styles.tabPaneContent}>
                        <Title level={4}>Изменить пароль</Title>
                        {passwordError && <Alert message={passwordError} type="error" showIcon style={{ marginBottom: 15 }} closable onClose={() => setPasswordError(null)}/>}
                        <Form
                            form={passwordForm}
                            layout="vertical"
                            onFinish={onChangePassword}
                            className={styles.formSection}
                        >
                            <Form.Item
                                name="currentPassword"
                                label="Текущий пароль"
                                rules={[{ required: true, message: 'Введите текущий пароль!' }]}
                            >
                                <Input.Password prefix={<LockOutlined />} />
                            </Form.Item>
                            <Form.Item
                                name="newPassword"
                                label="Новый пароль"
                                rules={[{ required: true, message: 'Введите новый пароль!' }]}
                                hasFeedback
                            >
                                <Input.Password prefix={<LockOutlined />} />
                            </Form.Item>
                            <Form.Item
                                name="confirmNewPassword"
                                label="Подтвердите новый пароль"
                                dependencies={['newPassword']}
                                hasFeedback
                                rules={[
                                    { required: true, message: 'Подтвердите новый пароль!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Пароли не совпадают!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loadingPassword}>
                                    Сменить пароль
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </TabPane>

                <TabPane tab="Избранное" key="3">
                    <div className={styles.tabPaneContent}>
                        <Title level={4}>Мои избранные товары</Title>
                        {favorites.length === 0 ? (
                            <Empty description="Вы еще не добавили товары в избранное." />
                        ) : (
                            <List
                                itemLayout="horizontal"
                                dataSource={favorites}
                                className={styles.favoritesList}
                                renderItem={(item) => (
                                    <List.Item
                                        key={item.id}
                                        actions={[
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => {
                                                    removeFromFavorites(item.id);
                                                    message.info(`${item.title} удален из избранного`);
                                                }}
                                            />,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.thumbnail} shape="square" size={64}/>}
                                            title={<Link to={`/product/${item.id}`}>{item.title}</Link>}
                                            description={item.brand || 'Бренд не указан'}
                                        />
                                        <div className={styles.favoritePrice}>${item.price.toFixed(2)}</div>
                                    </List.Item>
                                )}
                            />
                        )}
                    </div>
                </TabPane>


                <TabPane tab="Мои заказы" key="4">
                    <div className={styles.tabPaneContent}>
                        <Paragraph>Информация о ваших заказах будет отображаться здесь.</Paragraph>
                        <Empty description="У вас пока нет заказов."/>
                    </div>
                </TabPane>

                <TabPane tab="Адреса" key="5">
                    <div className={styles.tabPaneContent}>
                        <Paragraph>Управление адресами доставки.</Paragraph>
                        <Empty description="Адреса пока не добавлены."/>
                    </div>
                </TabPane>

                <TabPane tab="Настройки аккаунта" key="6">
                    <div className={styles.tabPaneContent}>
                        <Paragraph>Удаление аккаунта</Paragraph>
                        <Button type="primary" danger icon={<DeleteOutlined />} onClick={showDeleteConfirm}>
                            Удалить аккаунт
                        </Button>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ProfilePage;