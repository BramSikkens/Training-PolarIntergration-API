import express, { Request, Response } from "express";
import Team from "../entity/Team";
import User from "../entity/User";
import IRoutableController from "../interfaces/IRoutableController";
import TeamService from "../services/TeamService";
import UserService from "../services/UserService";

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
    this.createTeam = this.createTeam.bind(this);
    this.deleteTeam = this.deleteTeam.bind(this);
    this.getTeamById = this.getTeamById.bind(this);
    this.updateTeam = this.updateTeam.bind(this);
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
    this.router.delete(this.path + "/:teamId", this.deleteTeam.bind(this));
    this.router.get(this.path + "/:teamId", this.getTeamById.bind(this));
    this.router.put(this.path + "/:teamId", this.updateTeam.bind(this));
  }

  async createTeam(req: Request, res: Response): Promise<any> {
    const response = await this.teamService.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deleteTeam(req: Request, res: Response): Promise<any> {
    const { teamId } = req.params;
    const response = await this.teamService.remove(teamId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response);
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

  async getTeamById(req: Request, res: Response): Promise<any> {
    const { teamId } = req.params;
    const response = await this.teamService.getById(teamId, {
      relations: ["users"],
    });
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async updateTeam(req: Request, res: Response): Promise<any> {
    const { teamId } = req.params;
    const response = await this.teamService.update(teamId, req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
}

export default new TeamController(new TeamService(Team), new UserService(User));
