import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// В современном JavaScript (ES Modules) нет встроенной переменной __dirname, 
// поэтому мы получаем её вот таким способом:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TablesService {
  constructor() {
    this.dbPath = path.join(__dirname, '../db.json');
  }

  _readDb() {
    const fileContent = fs.readFileSync(this.dbPath, 'utf8');
    return JSON.parse(fileContent);
  }

  _writeDb(data) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf8');
  }

  _get(tableName) {
    const db = this._readDb();
    const records = db[tableName] || [];
    return { total: records.length, records };
  }

  _post(tableName, newRecord) {
    const db = this._readDb();
    if (!db[tableName]) db[tableName] = [];
    db[tableName].push(newRecord);
    this._writeDb(db);
    return newRecord;
  }

  _put(tableName, id, updatedData) {
    const db = this._readDb();
    if (!db[tableName]) return null;
    const index = db[tableName].findIndex(item => item.id === id);
    if (index !== -1) {
      db[tableName][index] = { ...db[tableName][index], ...updatedData };
      this._writeDb(db);
      return db[tableName][index];
    }
    return null;
  }

  _delete(tableName, id) {
    const db = this._readDb();
    if (!db[tableName]) return false;
    const initialLength = db[tableName].length;
    db[tableName] = db[tableName].filter(item => item.id !== id);
    if (db[tableName].length < initialLength) {
      this._writeDb(db);
      return true;
    }
    return false;
  }
}

export default new TablesService();