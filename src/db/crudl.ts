import db from '../lib/sqlite';
import { RunResult } from 'sqlite3'

class CRUDL {
  tableName: string|null = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  create(params: any) {
    const keys: string[] = [];
    const values: any[] = [];

    for (const [ key, value] of Object.entries(params)) {
      keys.push(key);
      values.push(value);
    }

    const sql = `
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${Array(keys.length).fill('?').join(', ')})
    `;

    return new Promise((resolve, reject) => {
      db.run(sql, values, function (this: RunResult, err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  }

  retrieve(id: number) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id=?`;

    return new Promise((resolve, reject) => {
      db.get(sql, [ id ], function (err, row) {
        if (err) return reject(err);
        resolve(row);
      })
    });
  }

  update(id: number, params: any) {
    const updateStatements: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(params)) {
      updateStatements.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);

    const sql = `UPDATE ${this.tableName} SET ${updateStatements.join(', ')} WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.run(sql, values, function (this: RunResult, err) {
        if (err) return reject(err);
        resolve(null);
      });
    });
  }

  destroy(id: number) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.run(sql, [ id ], function (err) {
        if (err) return reject(err);
        resolve(null);
      });
    });
  }

  list() {
    const sql = `SELECT * FROM ${this.tableName}`;

    return new Promise((resolve, reject) => {
      db.all(sql, function (err, rows) {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

export default CRUDL;
