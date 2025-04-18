import React from 'react';
import { List, Button, Typography, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useStore } from '../../features/store';
import styles from './FavoritesPage.module.css';

const { Title } = Typography;

const FavoritesPage = () => {
    const favorites = useStore((state) => state.favorites);
    const removeFromFavorites = useStore((state) => state.removeFromFavorites);

    return (
        <div className={styles.favoritesContainer}>
            <Title level={2}>Избранное</Title>
            {favorites.length === 0 ? (
                <Empty description="Вы еще не добавили товары в избранное" />
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={favorites}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeFromFavorites(item.id)}
                                />,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<img alt={item.title} src={item.thumbnail} style={{ width: 50 }} />}
                                title={<Link to={`/product/${item.id}`}>{item.title}</Link>}
                                description={`$${item.price.toFixed(2)}`}
                            />
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default FavoritesPage;