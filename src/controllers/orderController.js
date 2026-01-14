import { orders, getNextId } from '../data/orders.js';
import { products } from '../data/products.js';
import { customers } from '../data/customers.js';

export const getAllOrders = (req, res) => {
  res.status(200).json(orders);
};

export const getOrderById = (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.status(200).json(order);
};

function calculateTotal(items) {
  let total = 0;

  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    total += product.value * item.quantity;
  }

  return Number(total.toFixed(2));
}

export const createOrder = (req, res) => {
  const { customerId, items } = req.body;

  const customer = customers.find(c => c.id === Number(customerId));
  if (!customer) {
    return res.status(400).json({
      message: 'Order must have a valid customer'
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "'items' must be a non-empty array"
    });
  }

  for (const item of items) {
    if (!Number.isInteger(item.productId) || !Number.isInteger(item.quantity)) {
      return res.status(400).json({
        message: "'items' must contain productId and quantity as integers"
      });
    }

    if (item.quantity <= 0) {
      return res.status(400).json({
        message: "'quantity' must be greater than 0"
      });
    }

    const product = products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({
        message: `Product with id ${item.productId} not found`
      });
    }
  }

  const total = calculateTotal(items);

  const newOrder = {
    id: getNextId(),
    customerId: Number(customerId),
    items,
    total
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
};

export const updateOrder = (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const { customerId, items } = req.body;

  if (customerId !== undefined) {
    const customer = customers.find(c => c.id === Number(customerId));
    if (!customer) {
      return res.status(400).json({
        message: 'Order must have a valid customer'
      });
    }
    order.customerId = Number(customerId);
  }

  if (items !== undefined) {
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "'items' must be a non-empty array"
      });
    }

    for (const item of items) {
      if (!Number.isInteger(item.productId) || !Number.isInteger(item.quantity)) {
        return res.status(400).json({
          message: "'items' must contain productId and quantity as integers"
        });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({
          message: "'quantity' must be greater than 0"
        });
      }

      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(400).json({
          message: `Product with id ${item.productId} not found`
        });
      }
    }

    order.items = items;
    order.total = calculateTotal(items);
  }

  res.status(200).json(order);
};

export const deleteOrder = (req, res) => {
  const id = Number(req.params.id);
  const index = orders.findIndex(o => o.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const deleted = orders.splice(index, 1);
  res.status(200).json(deleted[0]);
};
