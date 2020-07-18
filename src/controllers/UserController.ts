import IRoutableController from "../interfaces/IRoutableController";
import UserService from "../services/UserService";
import express from "express";
import { Response, Request } from "express";
import User from "../entity/User";
import returnUserDTO from "../DTO/returnUserDTO";

class UserController implements IRoutableController {
  public path: string = "/users";
  public router: express.Router = express.Router();
  public service: UserService;

  constructor(service: UserService) {
    this.service = service;
    this.initializeRoutes();
    this.getUserById = this.getUserById.bind(this);
  }

  public initializeRoutes(): void {
    this.router.get(this.path + "/:userid", this.getUserById.bind(this));
  }

  // Begin Crud
  async createTeam(req: Request, res: Response): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async returnTeam(req: Request, res: Response): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async updateTeam(req: Request, res: Response): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async deleteTeam(req: Request, res: Response) {
    throw new Error("Method not implemented.");
  }
  // End CRUD

  async getUserById(req: Request, res: Response): Promise<any> {
    const { userid } = req.params;
    const response = await this.service.getById(userid, {});
    const user: returnUserDTO = {
      id: "string",
      username: "string",
      email: "string",
      dateOfBirth: "string",
      club: "string",
    };
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(user);
  }
}

export default new UserController(new UserService(User));
