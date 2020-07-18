import IRoutableController from "../interfaces/IRoutableController";
import UserService from "../services/UserService";
import express from "express";
import { Response, Request } from "express";
import Trainer from "../entity/Trainer";
import TrainerService from "../services/TrainerService";
import TeamService from "../services/TeamService";
import Team from "../entity/Team";

class TrainerController implements IRoutableController {
  public path: string = "/trainers";
  public router: express.Router = express.Router();
  public service: TrainerService;

  constructor(service: TrainerService) {
    this.service = service;
    this.initializeRoutes();
    this.getTrainerById = this.getTrainerById.bind(this);
  }

  public initializeRoutes(): void {
    this.router.get(this.path + "/:userid", this.getTrainerById.bind(this));
    this.router.post(this.path + "/:userid/teams/:teamid");
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

  async getTrainerById(req: Request, res: Response): Promise<any> {
    const { userid } = req.params;
    const response = await this.service.getById(userid, {
      relations: ["teams"],
    });
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
}

export default new TrainerController(new TrainerService(Trainer));
