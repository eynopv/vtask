import db from '../lib/sqlite';
import { RunResult } from 'sqlite3'

const TABLE_NAME = "Company";

export function create(params) {
  const sql = `INSERT INTO ${TABLE_NAME} (name, parentCompany) VALUES (?, ?)`;

  return new Promise((resolve, reject) => {
    db.run(sql, [ params.name, params.parent || null ], function (this: RunResult, err) {
      if (err) return reject(err);

      resolve({
        id: this.lastID,
        name: params.name,
        parentCompany: params.parent
      });
    });
  });
}

export function retrieve(id) {
  const sql = `SELECT * FROM ${TABLE_NAME} WHERE id=?`;

  return new Promise((resolve, reject) => {
    db.get(sql, [ id ], function (err, row) {
      if (err) return reject(err);
      console.log('Row', row);
      resolve(row);
    })
  });
}

export function update(id, params) {
  const updateStatements: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(params)) {
    updateStatements.push(`${key} = ?`);
    values.push(value);
  }
  values.push(id);

  const sql = `UPDATE ${TABLE_NAME} SET ${updateStatements.join(', ')} WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.run(sql, values, function (this: RunResult, err) {
      if (err) return reject(err);
      resolve(null);
    });
  });
}

export function destroy(id) {
  const sql = `DELETE FROM ${TABLE_NAME} WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.run(sql, [ id ], function (err, result) {
      if (err) return reject(err);
      console.log('Result', result);
      resolve(result);
    });
  });
}

export function list() {
  const sql = `SELECT * FROM ${TABLE_NAME}`;

  return new Promise((resolve, reject) => {
    db.all(sql, function (err, rows) {
      if (err) return reject(err);
      console.log('Rows', rows);
      resolve(rows);
    });
  });
}
