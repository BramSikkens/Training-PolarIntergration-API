import BaseController from "./BaseController";
import User from "../entity/User";
import express from "express";
import IRoutableController from "../interfaces/IRoutableController";
import UserService from "../services/UserService";

class UserController extends BaseController implements IRoutableController {
  public path: string = "/users";
  public router: express.Router = express.Router();

  constructor(service: UserService) {
    super(service);
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(this.path, this.insert);
  }
}

export default new UserController(new UserService(User));
