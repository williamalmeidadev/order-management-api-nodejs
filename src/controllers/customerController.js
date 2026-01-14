import * as customerService from '../services/customerService.js';

export const getAllCustomers = (req, res) => {
  const customers = customerService.getAllCustomers();
  res.status(200).json(customers);
};

export const getCustomerById = (req, res) => {
  const id = Number(req.params.id);
  const customer = customerService.getCustomerById(id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.status(200).json(customer);
};

export const createCustomer = (req, res) => {
  try {
    const newCustomer = customerService.createCustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCustomer = (req, res) => {
  try {
    const updatedCustomer = customerService.updateCustomer(Number(req.params.id), req.body);
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCustomer = (req, res) => {
  const deletedCustomer = customerService.deleteCustomer(Number(req.params.id));
  if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
  res.status(200).json(deletedCustomer);
};
