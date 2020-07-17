import BaseService from "./BaseService";
import Athlete from "../entity/Athlete";

export default class AthleteService extends BaseService<Athlete> {
  constructor(model: any) {
    super(model);
  }
}
