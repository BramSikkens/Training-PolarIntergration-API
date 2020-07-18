import Team from "../entity/Team";

export default interface ITrainerService {
  addTeamToTrainer(team: Team, trainerId: string): Promise<any>;
}
