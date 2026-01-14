import * as productService from '../services/productService.js';

export const getAllProducts = (req, res) => {
  const products = productService.getAllProducts();
  res.status(200).json(products);
};

export const getProductById = (req, res) => {
  const id = Number(req.params.id);
  const product = productService.getProductById(id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(200).json(product);
};

export const createProduct = (req, res) => {
  try {
    const newProduct = productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProduct = (req, res) => {
  try {
    const updatedProduct = productService.updateProduct(Number(req.params.id), req.body);
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProduct = (req, res) => {
  const deletedProduct = productService.deleteProduct(Number(req.params.id));
  if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
  res.status(200).json(deletedProduct);
};
