import BaseService from "./BaseService";
import ITrainerService from "../interfaces/ITrainerService";
import Team from "../entity/Team";
import { getRepository, EntitySchema } from "typeorm";
import Trainer from "../entity/Trainer";

export default class TrainerService extends BaseService<Trainer>
  implements ITrainerService {
  constructor(model: any) {
    super(model);
  }

  // Eigenlijk overbodig
  async addTeamToTrainer(team: Team, trainerId: string): Promise<any> {
    const repository = getRepository(this.model);
    try {
      const trainer: Trainer = await repository.findOne(trainerId, {
        relations: ["teams"],
      });

      trainer.teams.push(team);
      const result = await repository.save(trainer);
      return {
        error: false,
        singleItem: result,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 400,
        message: error.errmsg || "Something went wrong",
        errors: error.errors,
      };
    }
  }
  removeTeamFromTrainer(userid: string, trainerId: string): boolean {
    throw new Error("Method not implemented.");
  }
}
