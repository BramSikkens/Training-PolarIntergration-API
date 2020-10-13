import { getRepository, Repository } from "typeorm";
import { MacroCycle } from "../entity/MacroCycle";
import BaseService from "./BaseService";

export default class MacroCycleService extends BaseService<MacroCycle> {
  constructor(model: any) {
    super(model);
  }

  async getMacroOfathletes(_userIds: any): Promise<any> {
    const repository: Repository<MacroCycle> = getRepository(this.model);
    try {
      const macroCycles = await repository
        .createQueryBuilder("macroCycle")
        .innerJoinAndSelect(
          "macroCycle.athletes",
          "macroCycleAthletes",
          "macroCycleAthletes.id IN (:userIds)",
          {
            userIds: _userIds,
          }
        )
        .getMany();

      return macroCycles;
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
