import userRepository from '../repositories/userRepository.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { ROLES, ROLE_VALUES } from '../constants/roles.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '24h';
const SALT_ROUNDS = 10;

export const authenticateUser = async (username, password) => {
  const user = await userRepository.findByUsername(username);
  
  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }

  return user;
};

export const getAllUsers = async () => {
  return await userRepository.findAll();
};

export const getUserById = async (id) => {
  return await userRepository.findById(id);
};

export const getUserByUsername = async (username) => {
  return await userRepository.findByUsername(username);
};

export const createUser = async ({ username, password, role, email }) => {
  if (typeof username !== 'string' || username.trim() === '') {
    throw new Error("'username' must be a non-empty string");
  }

  if (typeof password !== 'string' || password.trim() === '') {
    throw new Error("'password' must be a non-empty string");
  }

  if (typeof email !== 'string' || email.trim() === '') {
    throw new Error("'email' must be a non-empty string");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("'email' must be a valid email address");
  }

  if (!ROLE_VALUES.includes(role)) {
    throw new Error(`'role' must be one of: ${ROLE_VALUES.join(', ')}`);
  }

  const existingUserByUsername = await userRepository.findByUsername(username.trim());
  if (existingUserByUsername) {
    throw new Error('Username already exists');
  }

  const existingUserByEmail = await userRepository.findByEmail(email.trim());
  if (existingUserByEmail) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const id = uuidv4();
  const newUser = {
    id,
    username: username.trim(),
    password: hashedPassword,
    email: email.trim().toLowerCase(),
    role: role
  };

  await userRepository.create(id, newUser);
  return newUser;
};

export const updateUser = async (username, { password, role, email }, currentUsername) => {
  const user = await userRepository.findByUsername(username);
  
  if (!user) {
    return null;
  }

  if (currentUsername === username && role !== undefined && user.role !== role) {
    throw new Error('You cannot change your own role');
  }

  if (password !== undefined) {
    if (typeof password !== 'string' || password.trim() === '') {
      throw new Error("'password' must be a non-empty string");
    }
    user.password = await bcrypt.hash(password, SALT_ROUNDS);
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || email.trim() === '') {
      throw new Error("'email' must be a non-empty string");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("'email' must be a valid email address");
    }

    const existingUserByEmail = await userRepository.findByEmail(email.trim());
    if (existingUserByEmail && existingUserByEmail.id !== user.id) {
      throw new Error('Email already in use');
    }
    user.email = email.trim().toLowerCase();
  }

  if (role !== undefined) {
    if (!ROLE_VALUES.includes(role)) {
      throw new Error(`'role' must be one of: ${ROLE_VALUES.join(', ')}`);
    }
    user.role = role;
  }

  await userRepository.update(user.id, user);
  return user;
};

export const deleteUser = async (username, currentUsername) => {
  if (currentUsername === username) {
    throw new Error('You cannot delete your own account');
  }

  const user = await userRepository.findByUsername(username);
  
  if (!user) {
    return null;
  }

  await userRepository.delete(user.id);
  return user;
};

export const generateToken = (user) => {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role
  };
  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
