import CompletedTraining from "../entity/CompletedTraining";
import BaseService from "./BaseService";

export default class CompletedTrainingService extends BaseService<
  CompletedTraining
> {
  constructor(model: any) {
    super(model);
  }
}
