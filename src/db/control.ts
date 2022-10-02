import db from '../lib/sqlite';
import { TABLE_NAMES } from './helpers';

function createTables() {
  createCompanyTable();
  createStationTypeTable();
  createStationTable();
}

function createCompanyTable() {
  const tableName = TABLE_NAMES.COMPANY;
  const definition = `
    id INTEGER,
    name TEXT NOT NULL,
    parentCompany INTEGER,
    FOREIGN KEY (parentCompany) REFERENCES ${tableName}(id),
    PRIMARY KEY (id)
  `;

  return create(tableName, definition);
}

function createStationTypeTable() {
  const tableName = TABLE_NAMES.STATION_TYPE;
  const definition = `
    id INTEGER,
    name TEXT NOT NULL,
    maxPower NUMERIC NOT NULL,
    PRIMARY KEY (id)
  `;

  return create(tableName, definition);
}

function createStationTable() {
  const tableName = TABLE_NAMES.STATION;
  const definition = `
    id INTEGER,
    name TEXT,
    typeId INTEGER NOT NULL,
    companyId INTEGER NOT NULL,
    FOREIGN KEY (typeId) REFERENCES ${TABLE_NAMES.STATION_TYPE}(id),
    PRIMARY KEY (id)
  `;
  return create(tableName, definition);
}

function create(tableName: string, definition: string) {
  console.log(`Creating "${tableName}" table`);

  return db.run(`CREATE TABLE ${tableName} (
    ${definition}
  )`, (err) => {
    if (err) {
      console.log(`Unable to create "${tableName}" table`, err.message);
    } else {
      console.log(`Table "${tableName}" is created`);
    }
  });
}

function deleteTables() {
  dropCompanyTable();
  dropStationTable();
  dropStationTypeTable();
}

function dropCompanyTable() {
  return drop(TABLE_NAMES.COMPANY);
}

function dropStationTable() {
  return drop(TABLE_NAMES.STATION);
}

function dropStationTypeTable() {
  return drop(TABLE_NAMES.STATION_TYPE);
}

function drop(tableName: string) {
  console.log(`Deleting "${tableName}" table`);

  db.run(`DROP TABLE ${tableName}`, (err) => {
    if (err) {
      console.log(`Unable to delete "${tableName}" table`, err.message);
    } else {
      console.log(`Table "${tableName}" is deleted`);
    }
  });

}

function main() {
  if (process.env.DB_INIT) {
    return createTables();
  }

  if (process.env.DB_DELETE) {
    return deleteTables();
  }
}

main();
