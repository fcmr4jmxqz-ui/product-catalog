import axios from "axios";
import { Product } from "../types/Product";

interface ProductResponse {
  products: Product[];
  total: number;
  limit: number;
  skip: number;
}
const api = axios.create({
  baseURL: "https://dummyjson.com",
});

export async function getProducts(
  limit: number,
  skip: number,
): Promise<{ products: Product[]; total: number }> {
  const response = await api.get<ProductResponse>("/products", {
    params: {
      limit: limit,
      skip: skip,
    },
  });

  return { products: response.data.products, total: response.data.total };
}
