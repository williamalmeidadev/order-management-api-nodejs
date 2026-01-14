import { products, getNextId } from '../data/products.js';

export const getAllProducts = () => products;

export const getProductById = (id) => products.find(p => p.id === id);

export const createProduct = ({ name, value }) => {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error("'name' must be a non-empty string");
  }

  const numValue = Number(value);
  if (Number.isNaN(numValue)) throw new Error("'value' must be a numeric value");
  if (numValue < 0) throw new Error("'value' must be greater than or equal to 0");

  const fixedValue = Number(numValue.toFixed(2));

  const newProduct = {
    id: getNextId(),
    name: name.trim(),
    value: fixedValue
  };

  products.push(newProduct);
  return newProduct;
};

export const updateProduct = (id, { name, value }) => {
  const product = products.find(p => p.id === id);
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

  return product;
};

export const deleteProduct = (id) => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  return products.splice(index, 1)[0];
};
