import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchProducts = async () => {
  const { data } = await axios.get('https://dummyjson.com/products?limit=100');
  return data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};