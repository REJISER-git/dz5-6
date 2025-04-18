import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../features/store';
import styles from './AuthForm.module.css';

const { Title } = Typography;

const RegisterPage = () => {
    const navigate = useNavigate();
    const register = useStore((state) => state.register);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setError(null);
        setLoading(true);
        try {
            const result = register({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password
            });

            if (result.success) {
                message.success(`Регистрация успешна! Добро пожаловать, ${result.user.firstName || result.user.email}!`);
                navigate('/');
            } else {
                setError(result.message || 'Ошибка регистрации.');
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError('Произошла ошибка при регистрации. Попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <Title level={3} className={styles.formTitle}>Регистрация</Title>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '20px' }} closable onClose={() => setError(null)}/>}
            <Form
                form={form}
                name="register"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item
                    name="firstName"
                    label="Имя"
                    rules={[{ required: true, message: 'Пожалуйста, введите ваше имя!', whitespace: true }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Имя" />
                </Form.Item>

                <Form.Item
                    name="lastName"
                    label="Фамилия"
                    rules={[{ required: true, message: 'Пожалуйста, введите вашу фамилию!', whitespace: true }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Фамилия" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Пожалуйста, введите ваш Email!' },
                        { type: 'email', message: 'Пожалуйста, введите корректный Email!' }
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
                    hasFeedback
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Подтвердите пароль"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Пожалуйста, подтвердите ваш пароль!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Два введенных пароля не совпадают!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите пароль" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Зарегистрироваться
                    </Button>
                </Form.Item>
            </Form>
            <div className={styles.switchLink}>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </div>
        </div>
    );
};

export default RegisterPage;