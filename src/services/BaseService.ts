import IBaseService from "../interfaces/IBaseService";
import ErrorDTO from "../DTO/ErrorDTO";
import {
  getRepository,
  DeleteResult,
  FindOneOptions,
  Repository,
  FindManyOptions,
  EntitySchema,
  UpdateResult,
} from "typeorm";

export default abstract class BaseService<T> implements IBaseService {
  model: EntitySchema<T>;
  constructor(model: EntitySchema<T>) {
    this.insert = this.insert.bind(this);
    this.model = model;
  }

  async insert(data: T): Promise<any> {
    const repository: Repository<T> = getRepository(this.model);
    try {
      const item: T = repository.create(data);
      const savedItem: T = await repository.save(item);
      if (savedItem) {
        return savedItem;
      }
    } catch (error) {
      const errormsg: ErrorDTO = {
        statusCode: 500,
        message: error.errmsg || "Not able to create item",
        errors: error,
      };
      return errormsg;
    }
  }

  async getById(id: string, options?: FindOneOptions): Promise<any> {
    const repository: Repository<T> = getRepository(this.model);
    try {
      const singleItem: T = await repository.findOne(id, options);
      if (singleItem) {
        return singleItem;
      } else {
        throw new Error("Item not found");
      }
    } catch (error) {
      const errorMessage: ErrorDTO = {
        statusCode: 500,
        message: error.message || "Not able to get item",
        errors: error.errors,
      };
      return errorMessage;
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
  async update(id: string, data: any): Promise<any> {
    const repository = getRepository(this.model);
    const object: T = await repository.findOne(id);
    try {
      const updatedResult: any = await repository.save({
        ...object,
        ...data,
      });
      if (updatedResult) {
        return updatedResult;
      }
    } catch (error) {
      console.log(error);
      return {
        error: true,
        statusCode: 400,
        message: error.errmsg || "Could not update Item",
        errors: error.errors,
      };
    }
  }
  async remove(id: string) {
    const repository = getRepository(this.model);
    try {
      const deleteResult: DeleteResult = await repository.delete(id);
      if (deleteResult) {
        return {
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
