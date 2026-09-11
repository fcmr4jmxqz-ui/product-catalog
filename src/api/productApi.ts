import axios from 'axios';
import { Product } from '../types/Product';

const api = axios.create({
    baseURL: 'https://dummyjson.com',
});

export async function getProducts(limit:number, skip:number): Promise<Product[]>{
    const response = await api.get<ProductResponse>('/products',
    {
        params: {
            limit: limit,
            skip: skip,
        }
    });

return response.data.products;
}

interface ProductResponse{
    products: Product[];
    total: number;
    limit: number;
    skip: number;
}

