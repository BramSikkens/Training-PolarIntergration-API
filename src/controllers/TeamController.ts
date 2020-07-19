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
  private teamService: TeamService;
  private userService: UserService;

  constructor(teamService: TeamService, userService: UserService) {
    this.teamService = teamService;
    this.userService = userService;
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
    const user: User = await (await this.userService.getById(userId))
      .singleItem;
    const savedTeam: Team = await this.teamService.addUserToTeam(user, teamId);
    if (savedTeam) {
      return res.status(201).send(savedTeam);
    }
  }

  async removeUserFromTeam(req: Request, res: Response) {
    const { userId, teamId } = req.params;
    const team: Team = await this.teamService.removeUserFromTeam(
      teamId,
      userId
    );
    if (team) {
      return res.status(201).send(team);
    }
  }
}

export default new TeamController(new TeamService(Team), new UserService(User));
