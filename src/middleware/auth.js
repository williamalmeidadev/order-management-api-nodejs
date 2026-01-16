import * as loginService from '../services/loginService.js';

export function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
}

export function requireAuth(req, res, next) {
  const token = req.cookies.token;
  
  if (!token) {
    if (req.path === '/' || req.path === '/dashboard') {
      return res.redirect('/login');
    }
    return res.status(401).json({ message: 'Unauthorized - Token not provided' });
  }
  
  const decoded = loginService.verifyToken(token);
  
  if (!decoded) {
    res.clearCookie('token');
    if (req.path === '/' || req.path === '/dashboard') {
      return res.redirect('/login');
    }
    return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
  
  req.user = {
    userId: decoded.userId,
    username: decoded.username,
    role: decoded.role
  };
  
  next();
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied. You do not have access to this operation.' });
    }
    
    next();
  };
}

