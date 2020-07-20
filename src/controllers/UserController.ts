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
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

  public initializeRoutes(): void {
    this.router.post(this.path, this.create.bind(this));
    this.router.get(this.path + "/:userid", this.getById.bind(this));
    this.router.delete(this.path + "/:userId", this.delete.bind(this));
    this.router.put(this.path + "/:userId", this.update.bind(this));
  }

  async create(req: Request, res: Response): Promise<Response<any>> {
    const response = await this.userService.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async update(req: Request, res: Response): Promise<Response<any>> {
    const { userId } = req.params;
    const response = await this.userService.update(userId, req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async delete(req: Request, res: Response): Promise<Response<any>> {
    const { userId } = req.params;
    const response = await this.userService.remove(userId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response);
  }

  async getById(req: Request, res: Response): Promise<Response<any>> {
    const { userid } = req.params;
    try {
      const response = await this.userService.getById(userid, {});
      if (response.error) return res.status(response.statusCode).send(response);
      const user: ReturnUserDto = {
        id: response.id,
        username: response.username,
        email: response.email,
        dateOfBirth: response.dateOfBirth.toString(),
        club: response.club,
        type: response.type,
      };
      return res.status(201).send(user);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

export default new UserController(new UserService(User));
