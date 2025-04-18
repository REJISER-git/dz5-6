import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchProductById = async (productId) => {
    if (!productId) {
        throw new Error("Product ID is required");
    }
    const { data } = await axios.get(`https://dummyjson.com/products/${productId}`);
    return data;
};

export const useProductById = (productId) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: () => fetchProductById(productId),
        enabled: !!productId,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
};