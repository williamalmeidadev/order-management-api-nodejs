import orderRepository from '../repositories/orderRepository.js';
import productRepository from '../repositories/productRepository.js';
import customerRepository from '../repositories/customerRepository.js';
import { v4 as uuidv4 } from 'uuid';

const calculateTotal = async (items) => {
  let sum = 0;
  for (const item of items) {
    const product = await productRepository.findById(item.productId);
    if (product) {
      sum += product.value * item.quantity;
    }
  }
  return Number(sum.toFixed(2));
};

export const getAllOrders = async () => {
  return await orderRepository.findAll();
};

export const getOrderById = async (id) => {
  return await orderRepository.findById(id);
};

export const createOrder = async ({ customerId, items }) => {
  const customer = await customerRepository.findById(customerId);
  if (!customer) throw new Error('Order must have a valid customer');

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("'items' must be a non-empty array");
  }

  for (const item of items) {
    if (!item.productId || !Number.isInteger(item.quantity)) {
      throw new Error("'items' must contain productId and quantity (integer)");
    }
    if (item.quantity <= 0) throw new Error("'quantity' must be greater than 0");
    const product = await productRepository.findById(item.productId);
    if (!product) throw new Error(`Product with id ${item.productId} not found`);
  }

  const total = await calculateTotal(items);

  const id = uuidv4();
  const newOrder = {
    id,
    customerId,
    items,
    total
  };

  await orderRepository.create(id, newOrder);
  return newOrder;
};

export const updateOrder = async (id, { customerId, items }) => {
  const order = await orderRepository.findById(id);
  if (!order) return null;

  if (customerId !== undefined) {
    const customer = await customerRepository.findById(customerId);
    if (!customer) throw new Error('Order must have a valid customer');
    order.customerId = customerId;
  }

  if (items !== undefined) {
    if (!Array.isArray(items) || items.length === 0) throw new Error("'items' must be a non-empty array");

    for (const item of items) {
      if (!item.productId || !Number.isInteger(item.quantity)) {
        throw new Error("'items' must contain productId and quantity (integer)");
      }
      if (item.quantity <= 0) throw new Error("'quantity' must be greater than 0");
      const product = await productRepository.findById(item.productId);
      if (!product) throw new Error(`Product with id ${item.productId} not found`);
    }

    order.items = items;
    order.total = await calculateTotal(items);
  }

  await orderRepository.update(id, order);
  return order;
};

export const deleteOrder = async (id) => {
  const order = await orderRepository.findById(id);
  if (!order) return null;
  await orderRepository.delete(id);
  return order;
};

export const searchOrders = async ({ product_id, customer_id }) => {
  let result = await orderRepository.findAll();

  if (product_id !== undefined) {
    result = result.filter(order =>
      order.items.some(item => item.productId === product_id)
    );
  }

  if (customer_id !== undefined) {
    result = result.filter(order => order.customerId === customer_id);
  }

  return result;
};
