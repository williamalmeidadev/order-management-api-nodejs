import { customers, getNextId } from '../data/customers.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getAllCustomers = (req, res) => {
  res.status(200).json(customers);
};

export const getCustomerById = (req, res) => {
  const id = Number(req.params.id);
  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  res.status(200).json(customer);
};

export const createCustomer = (req, res) => {
  const { name, email } = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      message: "'name' must be a non-empty string"
    });
  }

  if (typeof email !== 'string' || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "'email' must be a valid email"
    });
  }

  const newCustomer = {
    id: getNextId(),
    name: name.trim(),
    email: email.toLowerCase()
  };

  customers.push(newCustomer);
  res.status(201).json(newCustomer);
};

export const updateCustomer = (req, res) => {
  const id = Number(req.params.id);
  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  const { name, email } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        message: "'name' must be a non-empty string"
      });
    }
    customer.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || !emailRegex.test(email)) {
      return res.status(400).json({
        message: "'email' must be a valid email"
      });
    }
    customer.email = email.toLowerCase();
  }

  res.status(200).json(customer);
};

export const deleteCustomer = (req, res) => {
  const id = Number(req.params.id);
  const index = customers.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  const deleted = customers.splice(index, 1);
  res.status(200).json(deleted[0]);
};
