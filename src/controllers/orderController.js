import * as orderService from '../services/orderService.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await orderService.getOrderById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const newOrder = await orderService.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await orderService.updateOrder(req.params.id, req.body);
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await orderService.deleteOrder(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(deletedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const searchOrders = async (req, res) => {
  try {
    const results = await orderService.searchOrders(req.query);
    res.status(200).json(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
