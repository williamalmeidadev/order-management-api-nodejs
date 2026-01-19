import app from './app.js';
import dotenv from 'dotenv';
import userRepository from './repositories/userRepository.js';
import customerRepository from './repositories/customerRepository.js';
import orderRepository from './repositories/orderRepository.js';
import productRepository from './repositories/productRepository.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = async (signal) => {
  console.log(`\n${signal} received. Closing HTTP server and database connections...`);
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    try {
      await Promise.all([
        userRepository.close(),
        customerRepository.close(),
        orderRepository.close(),
        productRepository.close()
      ]);
      console.log('All database connections closed');
      process.exit(0);
    } catch (error) {
      console.error('Error closing database connections:', error);
      process.exit(1);
    }
  });
  
  setTimeout(() => {
    console.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
