import IBaseService from "../interfaces/IBaseService";
import {
  getRepository,
  DeleteResult,
  FindOneOptions,
  Repository,
  FindManyOptions,
  EntitySchema,
} from "typeorm";

export default abstract class BaseService<T> implements IBaseService {
  model: EntitySchema<T>;
  constructor(model: EntitySchema<T>) {
    this.insert = this.insert.bind(this);
    this.model = model;
  }

  async insert(data: T): Promise<T | any> {
    const repository: Repository<T> = getRepository(this.model);
    try {
      const item: T = repository.create(data);
      const savedItem: T = await repository.save(item);
      if (savedItem) {
        return {
          error: false,
          savedItem,
        };
      }
    } catch (error) {
      console.log("error", error);
      return {
        error: true,
        statusCode: 500,
        message: error.errmsg || "Not able to create item",
        errors: error.errors,
      };
    }
  }

  async getById(id: string, options?: FindOneOptions) {
    const repository: Repository<T> = getRepository(this.model);
    try {
      const singleItem: T = await repository.findOne(id, options);
      if (singleItem) {
        return {
          error: false,
          singleItem,
        };
      }
    } catch (error) {
      return {
        error: true,
        statusCode: 400,
        message: error.errmsg || "Items Not Found",
        errors: error.errors,
      };
    }
  }

  async getAll(options: FindManyOptions) {
    const repository: Repository<T> = getRepository(this.model);
    try {
      const multipleItems: T[] = await repository.find(options);
      if (multipleItems) {
        return {
          error: false,
          multipleItems,
        };
      }
    } catch (error) {
      return {
        error: true,
        statusCode: 400,
        message: error.errmsg || "Item Not Found",
        errors: error.errors,
      };
    }
  }
  update(id: string, data: any) {
    throw new Error("Method not implemented.");
  }
  async remove(id: string) {
    const repository = getRepository(this.model);
    try {
      const deleteResult: DeleteResult = await repository.delete(id);
      if (deleteResult) {
        return {
          error: false,
          deleteResult,
        };
      }
    } catch (error) {
      return {
        error: true,
        statusCode: 400,
        message: error.errmsg || "Could not delete Item",
        errors: error.errors,
      };
    }
  }
}
