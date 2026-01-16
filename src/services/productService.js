import { getDB } from '../db/index.js';
import { PRODUCTS_PREFIX, getNextId } from '../data/products.js';

const getAllProducts = async () => {
  const db = getDB();
  const products = [];
  
  for await (const [key, value] of db.iterator()) {
    if (key.startsWith(PRODUCTS_PREFIX) && key !== 'product:counter') {
      products.push(value);
    }
  }
  
  return products;
};

const getProductById = async (id) => {
  const db = getDB();
  try {
    const product = await db.get(`${PRODUCTS_PREFIX}${id}`);
    return product;
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return null;
    }
    throw error;
  }
};

const createProduct = async ({ name, value }) => {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error("'name' must be a non-empty string");
  }

  const numValue = Number(value);
  if (Number.isNaN(numValue)) throw new Error("'value' must be a numeric value");
  if (numValue < 0) throw new Error("'value' must be greater than or equal to 0");

  const fixedValue = Number(numValue.toFixed(2));

  const id = await getNextId();
  const newProduct = {
    id,
    name: name.trim(),
    value: fixedValue
  };

  const db = getDB();
  await db.put(`${PRODUCTS_PREFIX}${id}`, newProduct);
  
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

  const db = getDB();
  await db.put(`${PRODUCTS_PREFIX}${id}`, product);
  
  return product;
};

const deleteProduct = async (id) => {
  const product = await getProductById(id);
  if (!product) return null;

  const db = getDB();
  await db.del(`${PRODUCTS_PREFIX}${id}`);
  
  return product;
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
