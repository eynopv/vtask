import CRUDL from './crudl';

const TABLE_NAME = 'Station';
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
