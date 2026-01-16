import * as loginService from '../services/loginService.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await loginService.authenticateUser(username, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = loginService.generateToken(user);

    res.cookie('token', token, { 
      httpOnly: true, 
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 
    });

    res.status(200).json({ 
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await loginService.getUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await loginService.getAllUsers();
    
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }));

    res.status(200).json(sanitizedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const newUser = await loginService.createUser(req.body);
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await loginService.getUserByUsername(username);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUsername = req.user.username;
    
    const updatedUser = await loginService.updateUser(username, req.body, currentUsername);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUsername = req.user.username;
    
    const deletedUser = await loginService.deleteUser(username, currentUsername);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      user: {
        id: deletedUser.id,
        username: deletedUser.username,
        email: deletedUser.email,
        role: deletedUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    res.status(200).json({
      message: 'Valid JWT token',
      user: req.user,
      tokenInfo: {
        userId: req.user.userId,
        username: req.user.username,
        role: req.user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
