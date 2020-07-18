import BaseService from "./BaseService";
import Team from "../entity/Team";
import ITeamService from "../interfaces/ITeamService";
import User from "../entity/User";
import { getRepository, Repository } from "typeorm";

export default class TeamService extends BaseService<Team>
  implements ITeamService {
  constructor(model: any) {
    super(model);
  }
  async addUserToTeam(user: User, teamId: string): Promise<Team | any> {
    const repository: Repository<Team> = getRepository(this.model);
    try {
      const team: Team = await repository.findOne(teamId, {
        relations: ["users"],
      });
      team.users.push(user);
      const savedTeam: Team = await repository.save(team);
      return savedTeam;
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: error.errmsg || "Not able to create item",
        errors: error.errors,
      };
    }
  }
  async removeUserFromTeam(
    teamId: string,
    userId: string
  ): Promise<Team | any> {
    const repository: Repository<Team> = getRepository(this.model);
    try {
      const team: Team = await repository.findOne(teamId, {
        relations: ["users"],
      });
      team.users = team.users.filter((item) => item.id.toString() !== userId);
      const savedTeam: Team = await repository.save(team);
      return savedTeam;
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: error.errmsg || "Not able to create item",
        errors: error.errors,
      };
    }
  }
}
