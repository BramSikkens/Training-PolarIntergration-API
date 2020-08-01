import PlannedTraining from "../entity/PlannedTraining";
import BaseService from "./BaseService";

export default class PlannedTrainingService extends BaseService<
  PlannedTraining
> {
  constructor(model: any) {
    super(model);
  }
}
