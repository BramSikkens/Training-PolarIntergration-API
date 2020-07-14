import BaseService from "./BaseService";
import ITrainerService from "../interfaces/ITrainerService";
import Team from "../entity/Team";

export default class TrainerService extends BaseService
  implements ITrainerService {
  constructor(model: any) {
    super(model);
  }
  addTeamToTrainer(team: Team): boolean {
    throw new Error("Method not implemented.");
  }
  removeTeamFromTrainer(userid: string, trainerId: string): boolean {
    throw new Error("Method not implemented.");
  }
}
