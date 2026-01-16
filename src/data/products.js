import { getDB } from '../db/index.js';

const PRODUCTS_PREFIX = 'product:';
const COUNTER_KEY = 'product:counter';

async function getNextId() {
  const db = getDB();
  try {
    const currentId = await db.get(COUNTER_KEY);
    const nextId = currentId + 1;
    await db.put(COUNTER_KEY, nextId);
    return nextId;
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      await db.put(COUNTER_KEY, 1);
      return 1;
    }
    throw error;
  }
}

export {
  PRODUCTS_PREFIX,
  COUNTER_KEY,
  getNextId
};