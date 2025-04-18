import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Row,
    Col,
    Image,
    Typography,
    Button,
    Spin,
    Alert,
    Rate,
    Divider,
    Input,
    Form,
    message,
    Tabs,
    Empty,
    Tooltip
} from 'antd';
import { ShoppingCartOutlined, HeartOutlined, LeftOutlined } from '@ant-design/icons';
import { useProductById } from '../../api/useProductById';
import { useStore, useIsFavorite } from '../../features/store';
import styles from './ProductDetailPage.module.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const animeReviewerNames = [
    "Сёко Нисимия", "Сёя Исида", "Юзуру Нишимия",
    "Юно Гасай ", "Юкитэру Амано", "Кобаяши.",
    "Нобунага Ода", "Гинтоки Саката", "Синсукэ Такасуги",
    "Шимура Шинпачи", "Кагура", "Сайтама",
    "Генос", "Садахару", "Суго Окита",
    "Эсдес", "L Лоулайт", "Акамэ",
    "АМК", "NULL",
    "Челси ", "Тацуми", "Спайк Шпигель",
    "Гатс", "Сато Тацухиро"
];


const ProductDetailPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading, isError, error } = useProductById(productId);

    const addToCart = useStore((state) => state.addToCart);
    const toggleFavorite = useStore((state) => state.toggleFavorite);
    const isFavorite = useIsFavorite(product?.id);

    const [reviewForm] = Form.useForm();
    const [submittingReview, setSubmittingReview] = useState(false);
    const [cartButtonAnimating, setCartButtonAnimating] = useState(false);
    const [favoriteButtonAnimating, setFavoriteButtonAnimating] = useState(false);

    const handleAddToCartAnimation = () => {
        if (!product) return;
        setCartButtonAnimating(true);
        addToCart(product);
        message.success(`"${product.title}" добавлен в корзину!`);
        setTimeout(() => setCartButtonAnimating(false), 300);
    };

    const handleToggleFavoriteAnimation = () => {
        if (!product) return;
        setFavoriteButtonAnimating(true);
        toggleFavorite(product);
        message.info(isFavorite ? `"${product.title}" удален из избранного` : `"${product.title}" добавлен в избранное`);
        setTimeout(() => setFavoriteButtonAnimating(false), 300);
    };

    const onFinishReview = (values) => {
        setSubmittingReview(true);
        console.log('Review Submitted:', values);
        setTimeout(() => {
            message.success('Спасибо за ваш отзыв!');
            reviewForm.resetFields();
            setSubmittingReview(false);
        }, 1000);
    };

    if (isLoading) {
        return <div className={styles.loadingContainer}><Spin size="large" /></div>;
    }

    if (isError) {
        return (
            <div className={styles.container}>
                <Alert message="Ошибка загрузки товара" description={error.message} type="error" showIcon />
                <Button icon={<LeftOutlined />} onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
                    На главную
                </Button>
            </div>
        );
    }

    if (!product) {
        return <Empty description="Товар не найден." />;
    }

    return (
        <div className={styles.container}>
            <Button icon={<LeftOutlined />} onClick={() => navigate(-1)} className={styles.backButton}>
                Назад
            </Button>
            <Row gutter={[32, 32]}>
                <Col xs={24} md={10} className={styles.imageCol}>
                    <Image.PreviewGroup
                        items={product.images || []}
                    >
                        <Image
                            width="100%"
                            src={product.thumbnail}
                            alt={product.title}
                            className={styles.mainImage}
                        />
                    </Image.PreviewGroup>
                    {product.images && product.images.length > 1 && (
                        <div className={styles.thumbnailList}>
                            {product.images.map((imgUrl, index) => (
                                <Image
                                    key={index}
                                    src={imgUrl}
                                    alt={`${product.title} - preview ${index + 1}`}
                                    className={styles.thumbnailImage}
                                    preview={{}}
                                />
                            ))}
                        </div>
                    )}
                </Col>

                <Col xs={24} md={14} className={styles.detailsCol}>
                    {product.brand && <Text type="secondary" className={styles.brand}>{product.brand}</Text>}
                    <Title level={2} className={styles.title}>{product.title}</Title>
                    <div className={styles.ratingStock}>
                        <Rate disabled allowHalf defaultValue={product.rating || 0} />
                        <Text type="secondary" style={{ marginLeft: 8 }}>({product.rating ? product.rating.toFixed(1) : 'N/A'})</Text>
                        <Divider type="vertical" />
                        <Text type={product.stock > 0 ? 'success' : 'danger'}>
                            {product.stock > 0 ? `В наличии (${product.stock})` : 'Нет в наличии'}
                        </Text>
                    </div>
                    <Paragraph className={styles.description}>{product.description}</Paragraph>
                    <Text className={styles.price}>${product.price?.toFixed(2)}</Text>

                    <div className={styles.actionButtons}>
                        <Button
                            type="primary"
                            icon={<ShoppingCartOutlined />}
                            size="large"
                            onClick={handleAddToCartAnimation}
                            disabled={product.stock === 0}
                            className={cartButtonAnimating ? styles.buttonAnimation : ''}
                        >
                            В корзину
                        </Button>
                        <Tooltip title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}>
                            <Button
                                icon={<HeartOutlined />}
                                size="large"
                                onClick={handleToggleFavoriteAnimation}
                                danger={isFavorite}
                                className={favoriteButtonAnimating ? styles.favoriteButtonAnimation : ''}
                            />
                        </Tooltip>
                    </div>

                    <Divider />

                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Описание" key="1">
                            <Paragraph>
                                <strong>Категория:</strong> {product.category} <br/>
                                <strong>Вес:</strong> {product.weight || 'N/A'} гр. <br/>
                                <strong>Размеры:</strong> {product.dimensions ? `${product.dimensions.width}x${product.dimensions.height}x${product.dimensions.depth} cm` : 'N/A'} <br/>
                                <strong>Гарантия:</strong> {product.warrantyInformation || 'N/A'} <br/>
                                <strong>Доставка:</strong> {product.shippingInformation || 'N/A'} <br/>
                                <strong>Политика возврата:</strong> {product.returnPolicy || 'N/A'}
                            </Paragraph>
                        </TabPane>
                        <TabPane tab="Отзывы" key="2">
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((review, index) => (
                                    <div key={index} className={styles.reviewItem}>
                                        <Rate disabled defaultValue={review.rating} size="small"/>
                                        <Text strong style={{marginLeft: 8}}>
                                            {animeReviewerNames[index % animeReviewerNames.length]}
                                        </Text>
                                        <Text type="secondary" style={{marginLeft: 8}}> - {new Date(review.date).toLocaleDateString()}</Text>
                                        <Paragraph italic style={{marginTop: 5}}>"{review.comment}"</Paragraph>
                                        {index < product.reviews.length - 1 && <Divider dashed />}
                                    </div>
                                ))
                            ) : (
                                <Empty description="Отзывов пока нет."/>
                            )}

                            <Divider>Оставить отзыв</Divider>
                            <Form
                                form={reviewForm}
                                layout="vertical"
                                onFinish={onFinishReview}
                                className={styles.reviewForm}
                            >
                                <Form.Item
                                    name="rating"
                                    label="Ваша оценка"
                                    rules={[{ required: true, message: 'Пожалуйста, поставьте оценку!' }]}
                                >
                                    <Rate />
                                </Form.Item>
                                <Form.Item
                                    name="reviewerName"
                                    label="Ваше имя"
                                    rules={[{ required: true, message: 'Пожалуйста, введите ваше имя!' }]}
                                >
                                    <Input placeholder="Имя"/>
                                </Form.Item>
                                <Form.Item
                                    name="comment"
                                    label="Ваш отзыв"
                                    rules={[{ required: true, message: 'Пожалуйста, напишите отзыв!' }]}
                                >
                                    <TextArea rows={4} placeholder="Напишите ваш отзыв здесь..."/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={submittingReview}>
                                        Отправить отзыв
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetailPage;