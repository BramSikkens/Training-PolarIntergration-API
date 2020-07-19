import IRoutableController from "../interfaces/IRoutableController";
import UserService from "../services/UserService";
import express from "express";
import { Response, Request } from "express";
import User from "../entity/User";
import { ReturnUserDto } from "../DTO/RequestDTOs";

class UserController implements IRoutableController {
  public path: string = "/users";
  public router: express.Router = express.Router();
  public userService: UserService;

  constructor(service: UserService) {
    this.userService = service;
    this.initializeRoutes();
    this.getUserById = this.getUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  public initializeRoutes(): void {
    this.router.get(this.path + "/:userid", this.getUserById.bind(this));
    this.router.post(this.path, this.createUser.bind(this));
    this.router.delete(this.path + "/:userId", this.deleteUser.bind(this));
    this.router.put(this.path + "/:userId", this.updateUser.bind(this));
  }

  async createUser(req: Request, res: Response): Promise<any> {
    const response = await this.userService.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async updateUser(req: Request, res: Response): Promise<any> {
    const { userId } = req.params;
    const response = await this.userService.update(userId, req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deleteUser(req: Request, res: Response) {
    const { userId } = req.params;
    const response = await this.userService.remove(userId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response);
  }

  async getUserById(req: Request, res: Response): Promise<any> {
    const { userid } = req.params;
    const response = await this.userService.getById(userid, {});
    const user: ReturnUserDto = {
      id: "string",
      username: "string",
      email: "string",
      dateOfBirth: "string",
      club: "string",
      type: "string",
    };
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(user);
  }
}

export default new UserController(new UserService(User));
