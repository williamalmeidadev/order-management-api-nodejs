import * as customerService from '../services/customerService.js';

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await customerService.getCustomerById(id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const newCustomer = await customerService.createCustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await customerService.updateCustomer(req.params.id, req.body);
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await customerService.deleteCustomer(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(deletedCustomer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
