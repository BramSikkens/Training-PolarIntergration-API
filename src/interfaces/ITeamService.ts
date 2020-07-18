import User from "../entity/User";
import Team from "../entity/Team";

export default interface ITeamService {
  addUserToTeam(user: User, teamId: string): Team | any;
  removeUserFromTeam(teamId: string, userId: string): Team | any;
}
