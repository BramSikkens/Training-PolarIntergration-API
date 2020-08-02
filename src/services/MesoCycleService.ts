import { MesoCycle } from "../entity/MesoCycle";
import BaseService from "./BaseService";

export default class MesoCycleService extends BaseService<MesoCycle> {
  constructor(model: any) {
    super(model);
  }
}
