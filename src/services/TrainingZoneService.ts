import BaseService from "./BaseService";
import TrainingZone from "../entity/TrainingZone";

export default class TrainingZoneService extends BaseService<TrainingZone> {
  constructor(model: any) {
    super(model);
  }
}
