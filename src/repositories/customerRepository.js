import DB from '../db/index.js';

class CustomerRepository {
  constructor() {
    this.db = new DB('customers');
    this.initialized = false;
  }

  async init() {
    if (!this.initialized) {
      await this.db.init();
      this.initialized = true;
    }
  }

  async create(id, customer) {
    await this.init();
    const db = this.db.get();
    await db.put(id, customer);
    return customer;
  }

  async findById(id) {
    await this.init();
    const db = this.db.get();
    try {
      return await db.get(id);
    } catch (error) {
      if (error.code === 'LEVEL_NOT_FOUND') {
        return null;
      }
      throw error;
    }
  }

  async findAll() {
    await this.init();
    const db = this.db.get();
    const customers = [];
    for await (const [key, value] of db.iterator()) {
      customers.push(value);
    }
    return customers;
  }

  async update(id, customer) {
    await this.init();
    const db = this.db.get();
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }
    await db.put(id, customer);
    return customer;
  }

  async delete(id) {
    await this.init();
    const db = this.db.get();
    const existing = await this.findById(id);
    if (!existing) {
      return false;
    }
    await db.del(id);
    return true;
  }

  async close() {
    await this.db.close();
    this.initialized = false;
  }
}

export default new CustomerRepository();
