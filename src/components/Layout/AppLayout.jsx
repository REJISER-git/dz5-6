import React from 'react';
import { Layout, Menu, Button, Space, message } from 'antd';
import {
    HomeOutlined,
    ShoppingCartOutlined,
    HeartOutlined,
    LoginOutlined,
    UserAddOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../features/store';

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isAuthenticated = useStore(state => state.isAuthenticated);
    const currentUser = useStore(state => state.currentUser);
    const cartCount = useStore(state => state.cart.length);
    const favCount = useStore(state => state.favorites.length);
    const logout = useStore(state => state.logout);


    const handleLogout = () => {
        logout();
        message.success('Вы успешно вышли из системы.');
        navigate('/');
    };


    const getSelectedKeys = () => {
        if (location.pathname.startsWith('/profile')) return ['profile'];
        if (location.pathname === '/cart') return ['cart'];
        if (location.pathname === '/favorites') return ['favorites'];
        if (location.pathname === '/login') return ['login'];
        if (location.pathname === '/register') return ['register'];
        if (location.pathname === '/') return ['home'];
        return [];
    };

    return (
        <Layout className="layout" style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                <div className="logo" style={{ color: '#1890ff', marginRight: '24px', fontWeight: 'bold', fontSize: '1.2em' }}>
                    <RouterLink to="/" style={{color: '#1890ff'}}>MyApp</RouterLink>
                </div>

                <Menu
                    theme="light"
                    mode="horizontal"
                    selectedKeys={getSelectedKeys()}
                    style={{ flex: 1, minWidth: 0, lineHeight: '62px', borderBottom: 'none' }}
                >
                    <Menu.Item key="home" icon={<HomeOutlined />}>
                        <RouterLink to="/">Главная</RouterLink>
                    </Menu.Item>
                    <Menu.Item key="favorites" icon={<HeartOutlined />}>
                        <RouterLink to="/favorites">Избранное {favCount > 0 && `(${favCount})`}</RouterLink>
                    </Menu.Item>
                    <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
                        <RouterLink to="/cart">Корзина {cartCount > 0 && `(${cartCount})`}</RouterLink>
                    </Menu.Item>
                    {isAuthenticated && (
                        <Menu.Item key="profile" icon={<UserOutlined />} style={{ visibility: 'hidden' }}>
                        </Menu.Item>
                    )}
                </Menu>

                <Space style={{ marginLeft: '20px' }}>
                    {isAuthenticated ? (
                        <>
                            <Button icon={<UserOutlined />} onClick={() => navigate('/profile')}>
                                {currentUser?.firstName || currentUser?.email || 'Профиль'}
                            </Button>
                            <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button icon={<LoginOutlined />} onClick={() => navigate('/login')}>
                                Войти
                            </Button>
                            <Button type="primary" icon={<UserAddOutlined />} onClick={() => navigate('/register')}>
                                Регистрация
                            </Button>
                        </>
                    )}
                </Space>
            </Header>
            <Content style={{ padding: '0 24px', marginTop: '20px' }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                    {children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Сделал сайт для сирот. Но у него нет домашней страницы
            </Footer>
        </Layout>
    );
};

export default AppLayout;