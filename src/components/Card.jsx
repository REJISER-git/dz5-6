import React, { useState } from 'react';
import { Card, Button, Tooltip } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './Card.module.css';

const CardBody = ({ product, handleAddToCart, handleToggleFavorite }) => {
    const { id, title, description, price, thumbnail, brand } = product;
    const [cartButtonAnimating, setCartButtonAnimating] = useState(false);
    const [favoriteButtonAnimating, setFavoriteButtonAnimating] = useState(false);

    const handleAddToCartAnimation = () => {
        setCartButtonAnimating(true);
        handleAddToCart();
        setTimeout(() => {
            setCartButtonAnimating(false);
        }, 300);
    };

    const handleToggleFavoriteAnimation = () => {
        setFavoriteButtonAnimating(true);
        handleToggleFavorite();
        setTimeout(() => {
            setFavoriteButtonAnimating(false);
        }, 300);
    };


    return (
        <Card
            className={styles.card}
            cover={
                <Link to={`/product/${id}`}>
                    <div className={styles.imageContainer}>
                        <img
                            alt={title}
                            src={thumbnail}
                            className={styles.image}
                        />
                    </div>
                </Link>
            }
        >
            <div className={styles.content}>
                <div>
                    <Link to={`/product/${id}`}>
                        <h3 className={styles.title}>{title}</h3>
                    </Link>
                    {brand && <p className={styles.brand}>{brand}</p>}
                    <p className={styles.description}>{description}</p>
                </div>
                <div>
                    <p className={styles.price}>${price}</p>
                    <div className={styles.actions}>
                        <Button
                            icon={<ShoppingCartOutlined />}
                            onClick={handleAddToCartAnimation}
                            className={cartButtonAnimating ? styles.buttonAnimation : ''}
                        >
                            В корзину
                        </Button>
                        <Tooltip title="Добавить в избранное">
                            <Button
                                icon={<HeartOutlined />}
                                onClick={handleToggleFavoriteAnimation}
                                className={favoriteButtonAnimating ? styles.favoriteButtonAnimation : ''}
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CardBody;