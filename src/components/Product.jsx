import React, { useMemo } from 'react';
import { Row, Col, Spin, Typography, Empty, Input } from "antd";
import { useProducts } from "../api/useProducts";
import CardBody from "./Card";
import Slider from "./Slider";
import { useStore } from "../features/store";

const { Title, Text } = Typography;
const { Search } = Input;

const Products = () => {
    const { data, isLoading, isError, error } = useProducts();
    const { addToCart, toggleFavorite } = useStore();
    const searchTerm = useStore(state => state.searchTerm);
    const setSearchTerm = useStore(state => state.setSearchTerm);


    const filteredProducts = useMemo(() => {
        if (!data || !data.products) return [];
        if (!searchTerm) return data.products;

        const lowerSearchTerm = searchTerm.toLowerCase();
        return data.products.filter(product =>
            product.title.toLowerCase().includes(lowerSearchTerm) ||
            product.description.toLowerCase().includes(lowerSearchTerm) ||
            product.brand?.toLowerCase().includes(lowerSearchTerm)
        );
    }, [data, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (isLoading) return <div style={{ textAlign: 'center', margin: '50px' }}><Spin size="large" /></div>;
    if (isError) return <div style={{ color: 'red', textAlign: 'center', margin: '50px' }}>Ошибка загрузки данных: {error.message}</div>;
    if (!data || !data.products) return <div style={{ textAlign: 'center', margin: '50px' }}>Нет данных о товарах.</div>;


    return (
        <>
            <div style={{ marginTop: '20px', marginBottom: '40px' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
                    Популярные товары
                </Title>
                {data && data.products && data.products.length > 0 && (
                    <Slider
                        data={data.products}
                        sliceIndex={10}
                    />
                )}
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto 30px auto' }}>
                <Search
                    placeholder="Поиск товаров на странице..."
                    allowClear
                    enterButton
                    size="large"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onSearch={(value) => setSearchTerm(value)}
                />
            </div>

            {filteredProducts.length > 0 ? (
                <Row gutter={[16, 24]} justify="center" style={{ padding: '0 20px', marginBottom: '40px' }}>
                    {filteredProducts.map((product) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.id} style={{ display: 'flex', justifyContent: 'center' }}>
                            <CardBody
                                product={product}
                                handleAddToCart={() => addToCart(product)}
                                handleToggleFavorite={() => toggleFavorite(product)}
                            />
                        </Col>
                    ))}
                </Row>
            ) : (
                searchTerm && (
                    <div style={{ textAlign: 'center', margin: '50px 0' }}>
                        <Empty description={
                            <span>
                            По запросу "<Text strong>{searchTerm}</Text>" ничего не найдено.
                        </span>
                        }/>
                    </div>
                )
            )}

        </>
    );
};

export default Products;