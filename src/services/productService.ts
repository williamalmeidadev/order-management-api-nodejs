
import productRepository from '../repositories/productRepository.js';
import { v4 as uuidv4 } from 'uuid';

export interface Product {
  id: string;
  name: string;
  value: number;
}

export interface ProductCreateInput {
  name: string;
  value: number;
}

export interface ProductUpdateInput {
  name?: string;
  value?: number;
}

export const getAllProducts = async (): Promise<Product[]> => {
  return await productRepository.findAll();
};

export const getProductById = async (id: string): Promise<Product | null> => {
  return await productRepository.findById(id);
};

export const createProduct = async ({ name, value }: ProductCreateInput): Promise<Product> => {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error("'name' must be a non-empty string");
  }

  const numValue = Number(value);
  if (Number.isNaN(numValue)) throw new Error("'value' must be a numeric value");
  if (numValue < 0) throw new Error("'value' must be greater than or equal to 0");

  const fixedValue = Number(numValue.toFixed(2));

  const id = uuidv4();
  const newProduct: Product = {
    id,
    name: name.trim(),
    value: fixedValue
  };

  await productRepository.create(id, newProduct);
  return newProduct;
};

export const updateProduct = async (id: string, { name, value }: ProductUpdateInput): Promise<Product | null> => {
  const product = await getProductById(id);
  if (!product) return null;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error("'name' must be a non-empty string");
    }
    product.name = name.trim();
  }

  if (value !== undefined) {
    const numValue = Number(value);
    if (Number.isNaN(numValue)) throw new Error("'value' must be a numeric value");
    if (numValue < 0) throw new Error("'value' must be greater than or equal to 0");
    product.value = Number(numValue.toFixed(2));
  }

  await productRepository.update(id, product);
  return product;
};

export const deleteProduct = async (id: string): Promise<Product | null> => {
  const product = await getProductById(id);
  if (!product) return null;
  await productRepository.delete(id);
  return product;
};
