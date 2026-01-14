import * as orderService from '../services/orderService.js';

export const getAllOrders = (req, res) => {
  const orders = orderService.getAllOrders();
  res.status(200).json(orders);
};

export const getOrderById = (req, res) => {
  const id = Number(req.params.id);
  const order = orderService.getOrderById(id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.status(200).json(order);
};

export const createOrder = (req, res) => {
  try {
    const newOrder = orderService.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateOrder = (req, res) => {
  try {
    const updatedOrder = orderService.updateOrder(Number(req.params.id), req.body);
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteOrder = (req, res) => {
  const deletedOrder = orderService.deleteOrder(Number(req.params.id));
  if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
  res.status(200).json(deletedOrder);
};

export const searchOrders = (req, res) => {
  try {
    const results = orderService.searchOrders(req.query);
    res.status(200).json(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
