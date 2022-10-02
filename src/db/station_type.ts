import CRUDL from './crudl';
import { TABLE_NAMES } from './helpers';

const TABLE_NAME = TABLE_NAMES.STATION_TYPE;
const StationTypeCRUDL = new CRUDL(TABLE_NAME);

export function create(params: any) {
  return StationTypeCRUDL.create(params);
}

export function retrieve(id: number) {
  return StationTypeCRUDL.retrieve(id);
}

export function update(id: number, params: any) {
  return StationTypeCRUDL.update(id, params);
}

export function destroy(id: number) {
  return StationTypeCRUDL.destroy(id);
}

export function list() {
  return StationTypeCRUDL.list();
}
