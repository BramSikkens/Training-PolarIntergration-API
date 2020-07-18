import express from "express";
import Team from "../entity/Team";
import IRoutableController from "../interfaces/IRoutableController";
import TeamService from "../services/TeamService";
import { Response, Request } from "express";
import UserService from "../services/UserService";
import User from "../entity/User";

class TeamController implements IRoutableController {
  public path: string = "/teams";
  public router: express.Router = express.Router();
  public service: TeamService;

  constructor(service: TeamService) {
    this.service = service;
    this.initializeRoutes();
    this.addUserToTeam = this.addUserToTeam.bind(this);
    this.removeUserFromTeam = this.removeUserFromTeam.bind(this);
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
  }

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
