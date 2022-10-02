// Only works on empty DB
import { create as createCompany } from './company';
import { create as createStation } from './station';
import { create as createStationType } from './station_type';

/*
 * company 1
 * company 2
 * company 3
 */
function populateCompanies() {
  return createCompany({
    id: 1,
    name: 'Company 1'
  })
  .then(() => {
    return Promise.all([
      createCompany({ id: 2, name: 'Company 2', parentCompany: 1 }),
      createCompany({ id: 3, name: 'Company 3', parentCompany: 1 })
    ]);
  });
}

function populateStationTypes() {
  return createStationType({
    id: 1,
    name: 'Station Type 1',
    maxPower: 10
  });
}

/*
 * company 1 is a parent of 2 and 3
 * company 1 owns stations 5
 * company 2 owns stations 2, 3
 * company 3 owns stations 1, 4
 * all station is of same type with maxPower 10
 */
function populateStations() {
  return Promise.all([
    createStation({ id: 1, name: 'Station 1', typeId: 1, companyId: 3 }),
    createStation({ id: 2, name: 'Station 2', typeId: 1, companyId: 2 }),
    createStation({ id: 3, name: 'Station 3', typeId: 1, companyId: 2 }),
    createStation({ id: 4, name: 'Station 4', typeId: 1, companyId: 3 }),
    createStation({ id: 5, name: 'Station 5', typeId: 1, companyId: 1 }),
  ]);
}

function main() {
  console.log('About to populate db');

  populateCompanies()
    .then((result) => {
      console.log(result)
      return populateStationTypes()
    })
    .then((result) => {
      console.log(result);
      return populateStations();
    })
    .then((result) => {
      console.log(result);
      console.log('All done');
    })
    .catch((err) => {
      console.log(`Unable to populate all data`, err);
    });
}

main();
