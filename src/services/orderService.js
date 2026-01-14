import { orders, getNextId } from '../data/orders.js';
import { products } from '../data/products.js';
import { customers } from '../data/customers.js';

const calculateTotal = (items) => {
  return Number(items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.value * item.quantity : 0);
  }, 0).toFixed(2));
};

export const getAllOrders = () => orders;

export const getOrderById = (id) => orders.find(o => o.id === id);

export const createOrder = ({ customerId, items }) => {
  const customer = customers.find(c => c.id === Number(customerId));
  if (!customer) throw new Error('Order must have a valid customer');

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("'items' must be a non-empty array");
  }

  items.forEach(item => {
    if (!Number.isInteger(item.productId) || !Number.isInteger(item.quantity)) {
      throw new Error("'items' must contain productId and quantity as integers");
    }
    if (item.quantity <= 0) throw new Error("'quantity' must be greater than 0");
    const product = products.find(p => p.id === item.productId);
    if (!product) throw new Error(`Product with id ${item.productId} not found`);
  });

  const total = calculateTotal(items);

  const newOrder = {
    id: getNextId(),
    customerId: Number(customerId),
    items,
    total
  };

  orders.push(newOrder);
  return newOrder;
};

export const updateOrder = (id, { customerId, items }) => {
  const order = orders.find(o => o.id === id);
  if (!order) return null;

  if (customerId !== undefined) {
    const customer = customers.find(c => c.id === Number(customerId));
    if (!customer) throw new Error('Order must have a valid customer');
    order.customerId = Number(customerId);
  }

  if (items !== undefined) {
    if (!Array.isArray(items) || items.length === 0) throw new Error("'items' must be a non-empty array");

    items.forEach(item => {
      if (!Number.isInteger(item.productId) || !Number.isInteger(item.quantity)) {
        throw new Error("'items' must contain productId and quantity as integers");
      }
      if (item.quantity <= 0) throw new Error("'quantity' must be greater than 0");
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product with id ${item.productId} not found`);
    });

    order.items = items;
    order.total = calculateTotal(items);
  }

  return order;
};

export const deleteOrder = (id) => {
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;
  return orders.splice(index, 1)[0];
};

export const searchOrders = ({ product_id, customer_id }) => {
  let result = orders;

  if (product_id !== undefined) {
    const productId = Number(product_id);
    if (!Number.isInteger(productId)) throw new Error("'product_id' must be an integer");

    result = result.filter(order =>
      order.items.some(item => item.productId === productId)
    );
  }

  if (customer_id !== undefined) {
    const customerId = Number(customer_id);
    if (!Number.isInteger(customerId)) throw new Error("'customer_id' must be an integer");

    result = result.filter(order => order.customerId === customerId);
  }

  return result;
};
