import IBaseService from "../interfaces/IBaseService";
import { getRepository, DeleteResult } from "typeorm";

export default abstract class BaseService implements IBaseService {
  model: any;
  constructor(model: any) {
    this.insert = this.insert.bind(this);
    this.model = model;
  }

  async insert(data: any): Promise<any> {
    const repository = getRepository(this.model);
    try {
      const item: any = repository.create(data);
      const savedItem = await repository.save(item);
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

  async getById(id: string) {
    const repository = getRepository(this.model);
    try {
      const singleItem = await repository.findOne({ id });
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
        message: error.errmsg || "Item Not Found",
        errors: error.errors,
      };
    }
  }

  getAll(query: string) {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: any) {
    throw new Error("Method not implemented.");
  }
  async remove(id: string) {
    const repository = getRepository(this.model);
    try {
      let deleteResult: DeleteResult = await repository.delete(id);
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
