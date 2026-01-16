import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import cookieParser from 'cookie-parser';
import { logout, requireAuth } from './middleware/auth.js';

import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import loginRoutes from './routes/loginRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'none'"
  );
  next();
});

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : [];

app.use(cors({
    origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'dashboard.html'));
});

app.get('/', requireAuth, (req, res) => {
  res.redirect('/dashboard');
});

app.use(express.static('src/public'));

app.post('/api/logout', logout);

app.use('/api/login', loginRoutes);
app.use('/api/products', requireAuth, productRoutes);
app.use('/api/customers', requireAuth, customerRoutes);
app.use('/api/orders', requireAuth, orderRoutes);

export default app;
