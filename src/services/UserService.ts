import BaseService from "./BaseService";
import User from "../entity/User";

export default class UserService extends BaseService<User> {
  constructor(model: any) {
    super(model);
  }
}
