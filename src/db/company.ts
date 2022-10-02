import { TABLE_NAMES } from './helpers';
import CRUDL from './crudl';

const TABLE_NAME = TABLE_NAMES.COMPANY;

type Company = {
  id: number,
  name: string,
  parentCompany: number
}

const CompanyCRUDL = new CRUDL(TABLE_NAME);

export function create(params: Company) {
  return CompanyCRUDL.create(params);
}

export function retrieve(id: Company['id']) {
  return CompanyCRUDL.retrieve(id);
}

export function update(id: Company['id'], params: Company) {
  return CompanyCRUDL.update(id, params);
}

export function destroy(id: Company['id']) {
  return CompanyCRUDL.destroy(id);
}

export function list() {
  return CompanyCRUDL.list();
}
