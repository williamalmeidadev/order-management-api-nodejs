import DB from '../db/index.js';

class OrderRepository {
  constructor() {
    this.db = new DB('orders');
    this.initialized = false;
  }

  async init() {
    if (!this.initialized) {
      await this.db.init();
      this.initialized = true;
    }
  }

  async create(id, order) {
    await this.init();
    const db = this.db.get();
    await db.put(id, order);
    return order;
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
    const orders = [];
    for await (const [key, value] of db.iterator()) {
      orders.push(value);
    }
    return orders;
  }

  async update(id, order) {
    await this.init();
    const db = this.db.get();
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }
    await db.put(id, order);
    return order;
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

export default new OrderRepository();
