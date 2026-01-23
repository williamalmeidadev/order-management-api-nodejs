
import customerRepository from '../repositories/customerRepository.js';
import { v4 as uuidv4 } from 'uuid';

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface CustomerCreateInput {
  name: string;
  email: string;
}

export interface CustomerUpdateInput {
  name?: string;
  email?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const getAllCustomers = async (): Promise<Customer[]> => {
  return await customerRepository.findAll();
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  return await customerRepository.findById(id);
};

export const createCustomer = async ({ name, email }: CustomerCreateInput): Promise<Customer> => {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error("'name' must be a non-empty string");
  }
  if (typeof email !== 'string' || !emailRegex.test(email)) {
    throw new Error("'email' must be a valid email");
  }

  const id = uuidv4();
  const newCustomer: Customer = { id, name: name.trim(), email: email.toLowerCase() };
  await customerRepository.create(id, newCustomer);
  return newCustomer;
};

export const updateCustomer = async (id: string, { name, email }: CustomerUpdateInput): Promise<Customer | null> => {
  const customer = await customerRepository.findById(id);
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

  await customerRepository.update(id, customer);
  return customer;
};

export const deleteCustomer = async (id: string): Promise<Customer | null> => {
  const customer = await customerRepository.findById(id);
  if (!customer) return null;
  await customerRepository.delete(id);
  return customer;
};
