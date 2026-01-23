import { createUser } from './services/loginService.js';
import { ROLES } from './constants/roles.js';

async function seedAdmin() {
  try {
    const admin = await createUser({
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
      role: ROLES.ADMIN
    });
    
    console.log('Admin user created successfully:', {
      username: admin.username,
      email: admin.email,
      role: admin.role
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
}

seedAdmin();
