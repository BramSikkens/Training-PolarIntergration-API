import CompletedTraining from "../entity/CompletedTraining";
import BaseService from "./BaseService";
import { getRepository, Repository } from "typeorm";

export default class CompletedTrainingService extends BaseService<
  CompletedTraining
> {
  constructor(model: any) {
    super(model);
  }

}
