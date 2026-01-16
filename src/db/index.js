import { ClassicLevel } from 'classic-level';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/leveldb');

let db = null;

async function initDB() {
  if (db) {
    return db;
  }

  try {
    db = new ClassicLevel(dbPath, {
      valueEncoding: 'json',
      createIfMissing: true,
      errorIfExists: false
    });

    await db.open();
    console.log('LevelDB connected successfully');
    return db;
  } catch (error) {
    console.error('Error connecting to LevelDB:', error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
}


async function closeDB() {
  if (db) {
    await db.close();
    db = null;
    console.log('LevelDB disconnected');
  }
}

export {
  initDB,
  getDB,
  closeDB
};
