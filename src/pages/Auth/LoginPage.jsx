import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Alert, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../features/store';
import styles from './AuthForm.module.css';

const { Title } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();
    const login = useStore((state) => state.login);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setError(null);
        setLoading(true);
        try {
            const result = login({ email: values.email, password: values.password });

            if (result.success) {
                message.success(`Добро пожаловать, ${result.user.firstName || result.user.email}!`);
                navigate('/');
            } else {
                setError(result.message || 'Ошибка входа.');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError('Произошла ошибка. Попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <Title level={3} className={styles.formTitle}>Вход</Title>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '20px' }} closable onClose={() => setError(null)}/>}
            <Form
                form={form}
                name="login"
                onFinish={onFinish}
                initialValues={{ remember: true }}
                autoComplete="off"
            >
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Пожалуйста, введите ваш Email!' },
                        { type: 'email', message: 'Пожалуйста, введите корректный Email!' }
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Пожалуйста, введите ваш пароль!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Войти
                    </Button>
                </Form.Item>
            </Form>
            <div className={styles.switchLink}>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </div>
        </div>
    );
};

export default LoginPage;