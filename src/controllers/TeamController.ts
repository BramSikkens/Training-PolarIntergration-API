import express from "express";
import Team from "../entity/Team";
import IRoutableController from "../interfaces/IRoutableController";
import TeamService from "../services/TeamService";
import { Response, Request } from "express";
import UserService from "../services/UserService";
import User from "../entity/User";
import TrainerService from "../services/TrainerService";
import Trainer from "../entity/Trainer";

class TeamController implements IRoutableController {
  public path: string = "/teams";
  public router: express.Router = express.Router();
  public service: TeamService;

  constructor(service: TeamService) {
    this.service = service;
    this.initializeRoutes();
    this.addUserToTeam = this.addUserToTeam.bind(this);
    this.removeUserFromTeam = this.removeUserFromTeam.bind(this);
    this.createTeam = this.createTeam.bind(this);
  }

  public initializeRoutes(): void {
    this.router.post(
      this.path + "/:teamId/users/:userId",
      this.addUserToTeam.bind(this)
    );
    this.router.delete(
      this.path + "/:teamId/users/:userId",
      this.removeUserFromTeam.bind(this)
    );
    this.router.post(this.path, this.createTeam.bind(this));
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

  async addUserToTeam(req: Request, res: Response): Promise<any> {
    const { teamId, userId } = req.params;
    const userService: UserService = new UserService(User);
    const user: User = await (await userService.getById(userId)).singleItem;
    const savedTeam: Team = await this.service.addUserToTeam(user, teamId);
    if (savedTeam) {
      return res.status(201).send(savedTeam);
    }
  }

  async removeUserFromTeam(req: Request, res: Response) {
    const { userId, teamId } = req.params;
    const team: Team = await this.service.removeUserFromTeam(teamId, userId);
    if (team) {
      return res.status(201).send(team);
    }
  }
}

export default new TeamController(new TeamService(Team));
