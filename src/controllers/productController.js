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

    const newProduct = {
        id: getNextId(),
        name,
        value: parseFloat(Number(value).toFixed(2))
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

    product.name = req.body.name ?? product.name;
    product.value = req.body.value !== undefined ? parseFloat(Number(req.body.value).toFixed(2)) : product.value;

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
