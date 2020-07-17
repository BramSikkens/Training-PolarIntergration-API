import { FindOneOptions, FindManyOptions } from "typeorm";

export default interface IBaseService {
  insert(data: any): any;
  getAll(options: FindManyOptions): any;
  update(id: string, data: any): any;
  remove(id: string): any;
  getById(id: string, options?: FindOneOptions): any;
}
