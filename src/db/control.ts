import db from '../lib/sqlite';

function createTables() {
  createCompanyTable();
  createStationTypeTable();
  createStationTable();
}

function createCompanyTable() {
  console.log('Creating "Company" table');

  return db.run(`CREATE TABLE Company (
    id int unsigned NOT NULL,
    name varchar(255) NOT NULL,
    parentCompany int unsigned,
    FOREIGN KEY (parentCompany) REFERENCES Company(id),
    PRIMARY KEY (id)
  )`, (err) => {
    if (err) {
      console.log('Unable to create "Company" table', err.message);
    } else {
      console.log('Table "Company" is created');
    }
  });
}

function createStationTypeTable() {
  console.log('Creating "StationType" table');

  return db.run(`CREATE TABLE StationType (
    id int unsigned NOT NULL,
    name varchar(255) NOT NULL,
    maxPower int NOT NULL
  )`, (err) => {
    if (err) {
      console.log('Unable to create "StationType" table', err.message);
    } else {
      console.log('Table "StationType" is created');
    }
  });
}

function createStationTable() {
  console.log('Creating "Station" table');

  return db.run(`CREATE TABLE Station (
    id int unsigned NOT NULL,
    name varchar(255),
    typeId int unsigned NOT NULL,
    companyId int unsigned NOT NULL,
    FOREIGN KEY (typeId) REFERENCES StationType(id),
    PRIMARY KEY (id)
  )`, (err) => {
    if (err) {
      console.log('Unable to create "Station" table', err.message);
    } else {
      console.log('Table "Station" is created');
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
