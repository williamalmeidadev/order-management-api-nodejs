import productRepository from '../repositories/productRepository.js';
import { v4 as uuidv4 } from 'uuid';

const getAllProducts = async () => {
  return await productRepository.findAll();
};

const getProductById = async (id) => {
  return await productRepository.findById(id);
};

const createProduct = async ({ name, value }) => {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error("'name' must be a non-empty string");
  }

  const numValue = Number(value);
  if (Number.isNaN(numValue)) throw new Error("'value' must be a numeric value");
  if (numValue < 0) throw new Error("'value' must be greater than or equal to 0");

  const fixedValue = Number(numValue.toFixed(2));

  const id = uuidv4();
  const newProduct = {
    id,
    name: name.trim(),
    value: fixedValue
  };

  await productRepository.create(id, newProduct);
  
  return newProduct;
};

const updateProduct = async (id, { name, value }) => {
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

const deleteProduct = async (id) => {
  const product = await getProductById(id);
  if (!product) return null;

  await productRepository.delete(id);
  
  return product;
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
