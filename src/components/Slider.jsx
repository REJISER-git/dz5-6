import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from 'swiper/modules';
import CardBody from "./Card";
import { useStore } from "../features/store";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const Slider = ({ data, sliceIndex = 10 }) => {
    const { addToCart, toggleFavorite } = useStore();

    const breakpoints = {
        640: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 30
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 40
        }
    };

    const popularProducts = data.slice(0, sliceIndex);

    return (
        <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            loop={true}
            speed={800}
            autoplay={{
                delay: 3500,
                disableOnInteraction: false,
            }}
            breakpoints={breakpoints}
            style={{padding: '10px 0'}}
        >
            {popularProducts.map((product) => (
                <SwiperSlide key={product.id} style={{ display: 'flex', justifyContent: 'center' }}>
                    <CardBody
                        product={product}
                        handleAddToCart={() => addToCart(product)}
                        handleToggleFavorite={() => toggleFavorite(product)}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default Slider;