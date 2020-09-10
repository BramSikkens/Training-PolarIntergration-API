import PlannedTraining from "../entity/PlannedTraining";
import BaseService from "./BaseService";
import { getRepository, Repository } from "typeorm";

export default class PlannedTrainingService extends BaseService<
  PlannedTraining
> {
  constructor(model: any) {
    super(model);
  }

  async getPlannedTrainingsOfUser(_userIds: any): Promise<any> {
    console.log(typeof _userIds);
    const repository: Repository<PlannedTraining> = getRepository(this.model);
    try {
      const plannedTrainings = await repository
        .createQueryBuilder("plannedTraining")
        .innerJoinAndSelect(
          "plannedTraining.athletes",
          "plannedTrainingAthletes",
          "plannedTrainingAthletes.id IN (:userIds)",
          {
            userIds: _userIds,
          }
        )
        .getMany();

      console.log(plannedTrainings);

      return plannedTrainings;
    } catch (error) {
      console.log(error);
      return {
        error: true,
        statusCode: 500,
        message: error.errmsg || "Not able to create item",
        errors: error.errors,
      };
    }
  }
}
