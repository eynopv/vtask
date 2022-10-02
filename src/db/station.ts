import db from '../lib/sqlite';
import CRUDL from './crudl';
import { TABLE_NAMES } from './helpers';

const TABLE_NAME = TABLE_NAMES.STATION;
const StationCRUDL = new CRUDL(TABLE_NAME);

export function create(params: any) {
  return StationCRUDL.create(params);
}

export function retrieve(id: number) {
  return StationCRUDL.retrieve(id);
}

export function update(id: number, params: any) {
  return StationCRUDL.update(id, params);
}

export function destroy(id: number) {
  return StationCRUDL.destroy(id);
}

export function list() {
  return StationCRUDL.list();
}

export function retrievePopulatedCompanyRelated(companyId: number) {
  const sql = `
    WITH RelatedCompanies AS (
      SELECT id FROM ${TABLE_NAMES.COMPANY} WHERE id = $companyId OR parentCompany = $companyId
    ),
    PopulatedStations AS (
      SELECT s.id, s.name, s.companyId, st.maxPower
      FROM ${TABLE_NAME} AS s
      INNER JOIN ${TABLE_NAMES.STATION_TYPE} AS st
      ON s.typeId = st.id
    )
    SELECT ps.name, ps.id, ps.maxPower
    FROM RelatedCompanies AS rc
    JOIN PopulatedStations AS ps
    ON ps.companyId = rc.id
  `;

  return new Promise((resolve, reject) => {
    db.all(sql, { $companyId: companyId }, function (err, row) {
      if (err) return reject(err);
      resolve(row);
    });
  });
}
