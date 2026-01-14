import { products, getNextId } from '../data/products.js';

export const getAllProducts = (req, res) => {
    res.json(products);
};

export const getProductById = (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
};

export const createProduct = (req, res) => {
  const { name, value } = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      message: "'name' must be a non-empty string"
    });
  }

  const numValue = Number(value);
  if (Number.isNaN(numValue)) {
    return res.status(400).json({
      message: "'value' must be a numeric value"
    });
  }

  if (numValue < 0) {
    return res.status(400).json({
      message: "'value' must be greater than or equal to 0"
    });
  }

  const fixedValue = Number(numValue.toFixed(2));

  const newProduct = {
    id: getNextId(),
    name: name.trim(),
    value: fixedValue
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};



export const updateProduct = (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, value } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        message: "'name' must be a non-empty string"
      });
    }
    product.name = name.trim();
  }

  if (value !== undefined) {
    const numValue = Number(value);

    if (Number.isNaN(numValue)) {
      return res.status(400).json({
        message: "'value' must be a numeric value"
      });
    }

    if (numValue < 0) {
      return res.status(400).json({
        message: "'value' must be greater than or equal to 0"
      });
    }

    product.value = Number(numValue.toFixed(2));
  }

  res.status(200).json(product);
};


export const deleteProduct = (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const deleted = products.splice(index, 1);
    res.status(200).json(deleted[0]);
};
