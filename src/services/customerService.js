import { customers, getNextId } from '../data/customers.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getAllCustomers = () => customers;

export const getCustomerById = (id) => customers.find(c => c.id === id);

export const createCustomer = ({ name, email }) => {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error("'name' must be a non-empty string");
  }
  if (typeof email !== 'string' || !emailRegex.test(email)) {
    throw new Error("'email' must be a valid email");
  }

  const newCustomer = { id: getNextId(), name: name.trim(), email: email.toLowerCase() };
  customers.push(newCustomer);
  return newCustomer;
};

export const updateCustomer = (id, { name, email }) => {
  const customer = customers.find(c => c.id === id);
  if (!customer) return null;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error("'name' must be a non-empty string");
    }
    customer.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || !emailRegex.test(email)) {
      throw new Error("'email' must be a valid email");
    }
    customer.email = email.toLowerCase();
  }

  return customer;
};

export const deleteCustomer = (id) => {
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) return null;
  return customers.splice(index, 1)[0];
};
