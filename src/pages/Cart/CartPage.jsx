import React from 'react';
import { List, Button, Typography, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useStore } from '../../features/store';
import styles from './CartPage.module.css';

const { Title, Text } = Typography;

const CartPage = () => {
    const cart = useStore((state) => state.cart);
    const removeFromCart = useStore((state) => state.removeFromCart);
    const clearCart = useStore((state) => state.clearCart);

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className={styles.cartContainer}>
            <Title level={2}>Корзина</Title>
            {cart.length === 0 ? (
                <Empty description="Ваша корзина пуста" />
            ) : (
                <>
                    <List
                        itemLayout="horizontal"
                        dataSource={cart}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeFromCart(item.id)}
                                    />,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<img alt={item.title} src={item.thumbnail} style={{ width: 50 }} />}
                                    title={item.title}
                                    description={`$${item.price.toFixed(2)}`}
                                />
                            </List.Item>
                        )}
                    />
                    <div className={styles.cartTotal}>
                        <Text strong>Итого: ${total.toFixed(2)}</Text>
                        <Button type="primary" style={{ marginLeft: 'auto', marginRight: '10px' }}>Оформить заказ</Button>
                        <Button danger onClick={clearCart}>Очистить корзину</Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;