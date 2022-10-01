import sqlite3 from 'sqlite3';
import path from 'path';

const sqlite = sqlite3.verbose();

const dbFilePath = path.resolve(__dirname, '../../virta.db');
const db = new sqlite.Database(dbFilePath, (err) => {
  if (err) {
    console.log(err.message);
    process.exit(-1);
  } else {
    console.log(`sqlite connected to ${dbFilePath}`);
  }
});

export default db;
