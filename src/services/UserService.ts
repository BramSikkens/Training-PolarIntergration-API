import BaseService from "./BaseService";
import User from "../entity/User";
import { getRepository, Repository } from "typeorm";
import ErrorDTO from "../DTO/ErrorDTO";

export default class UserService extends BaseService<User> {
  constructor(model: any) {
    super(model);
  }

  async findUserByName(name: string): Promise<any> {
    const repository: Repository<User> = getRepository(User);
    try {
      const user: User = await repository.findOne({
        where: { username: name },
        relations: ["polarAuthorisation"],
      });
      return user;
    } catch (error) {
      const errorMessage: ErrorDTO = {
        statusCode: 500,
        message: error.message || "Not able to get item",
        errors: error.errors,
      };
      return errorMessage;
    }
  }
}
