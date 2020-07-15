import { FindOneOptions } from "typeorm";

export default interface IBaseService {
  insert(data: any): any;
  getAll(query: string): any;
  update(id: string, data: any): any;
  remove(id: string): any;

  getById(id: string, options?: FindOneOptions): any;
}
