import BaseService from "./BaseService";
import TrainingTemplate from "../entity/TrainingTemplate";

export default class TrainingTemplateService extends BaseService<
  TrainingTemplate
> {
  constructor(model: any) {
    super(model);
  }
}
