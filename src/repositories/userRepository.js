import DB from '../db/index.js';

class UserRepository {
  constructor() {
    this.db = new DB('users');
    this.initialized = false;
  }

  async init() {
    if (!this.initialized) {
      await this.db.init();
      this.initialized = true;
    }
  }

  async create(id, user) {
    await this.init();
    const db = this.db.get();
    await db.put(id, user);
    return user;
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

  async findByUsername(username) {
    await this.init();
    const db = this.db.get();
    const iterator = db.iterator();
    try {
      for await (const [key, value] of iterator) {
        if (value.username === username) {
          await iterator.close();
          return value;
        }
      }
      return null;
    } catch (error) {
      throw error;
    } finally {
      await iterator.close();
    }
  }

  async findByEmail(email) {
    await this.init();
    const db = this.db.get();
    const iterator = db.iterator();
    try {
      for await (const [key, value] of iterator) {
        if (value.email === email) {
          await iterator.close();
          return value;
        }
      }
      return null;
    } catch (error) {
      throw error;
    } finally {
      await iterator.close();
    }
  }

  async findAll() {
    await this.init();
    const db = this.db.get();
    const users = [];
    const iterator = db.iterator();
    try {
      for await (const [key, value] of iterator) {
        users.push(value);
      }
      return users;
    } finally {
      await iterator.close();
    }
  }

  async update(id, user) {
    await this.init();
    const db = this.db.get();
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }
    await db.put(id, user);
    return user;
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
    if (this.initialized) {
      await this.db.close();
      this.initialized = false;
    }
  }
}

export default new UserRepository();
