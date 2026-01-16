import { ClassicLevel } from 'classic-level';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class DB {
  constructor(dataType) {
    this.dataType = dataType;
    this.dbPath = path.join(__dirname, `../../data/databases/${dataType}`);
    this.db = null;
  }

  async init() {
    if (this.db) {
      return this.db;
    }

    try {
      this.db = new ClassicLevel(this.dbPath, {
        valueEncoding: 'json',
        createIfMissing: true,
        errorIfExists: false
      });

      await this.db.open();
      console.log(`LevelDB connected successfully for ${this.dataType}`);
      return this.db;
    } catch (error) {
      console.error(`Error connecting to LevelDB for ${this.dataType}:`, error);
      throw error;
    }
  }

  get() {
    if (!this.db) {
      throw new Error(`Database for ${this.dataType} not initialized. Call init() first.`);
    }
    return this.db;
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log(`LevelDB disconnected for ${this.dataType}`);
    }
  }
}

export default DB;
