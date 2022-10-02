import db from '../lib/sqlite';
import { TABLE_NAMES } from './helpers';

function createTables() {
  createCompanyTable();
  createStationTypeTable();
  createStationTable();
}

function createCompanyTable() {
  console.log(`Creating "${TABLE_NAMES.COMPANY}" table`);

  return db.run(`CREATE TABLE ${TABLE_NAMES.COMPANY} (
    id INTEGER,
    name TEXT NOT NULL,
    parentCompany INTEGER,
    FOREIGN KEY (parentCompany) REFERENCES ${TABLE_NAMES.COMPANY}(id),
    PRIMARY KEY (id)
  )`, (err) => {
    if (err) {
      console.log(`Unable to create "${TABLE_NAMES.COMPANY}" table`, err.message);
    } else {
      console.log(`Table "${TABLE_NAMES.COMPANY}" is created`);
    }
  });
}

function createStationTypeTable() {
  console.log(`Creating "${TABLE_NAMES.STATION_TYPE}" table`);

  return db.run(`CREATE TABLE ${TABLE_NAMES.STATION_TYPE} (
    id INTEGER,
    name TEXT NOT NULL,
    maxPower NUMERIC NOT NULL,
    PRIMARY KEY (id)
  )`, (err) => {
    if (err) {
      console.log(`Unable to create "${TABLE_NAMES.STATION_TYPE}" table`, err.message);
    } else {
      console.log(`Table "${TABLE_NAMES.STATION_TYPE}" is created`);
    }
  });
}

function createStationTable() {
  console.log(`Creating "${TABLE_NAMES.STATION}" table`);

  return db.run(`CREATE TABLE ${TABLE_NAMES.STATION} (
    id INTEGER,
    name TEXT,
    typeId INTEGER NOT NULL,
    companyId INTEGER NOT NULL,
    FOREIGN KEY (typeId) REFERENCES ${TABLE_NAMES.STATION_TYPE}(id),
    PRIMARY KEY (id)
  )`, (err) => {
    if (err) {
      console.log(`Unable to create "${TABLE_NAMES.STATION}" table`, err.message);
    } else {
      console.log(`Table "${TABLE_NAMES.STATION}" is created`);
    }
  });
}

function deleteTables() {
  dropCompanyTable();
  dropStationTable();
  dropStationTypeTable();
}

function dropCompanyTable() {
  console.log('Deleting "Company" table');

  db.run('DROP TABLE Company', (err) => {
    if (err) {
      console.log('Unable to delete "Company" table', err.message);
    } else {
      console.log('Table "Company" is deleted');
    }
  });
}

function dropStationTable() {
  console.log('Deleting "Station" table');

  db.run('DROP TABLE Station', (err) => {
    if (err) {
      console.log('Unable to delete "Station" table', err.message);
    } else {
      console.log('Table "Station" is deleted');
    }
  });
}

function dropStationTypeTable() {
  console.log('Deleting "StationType" table');

  db.run('DROP TABLE StationType', (err) => {
    if (err) {
      console.log('Unable to delete "StationType" table', err.message);
    } else {
      console.log('Table "StationType" is deleted');
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
