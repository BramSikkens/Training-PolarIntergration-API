import { MicroCycle } from "../entity/MicroCycle";
import BaseService from "./BaseService";

export default class MicroCycleService extends BaseService<MicroCycle> {
  constructor(model: any) {
    super(model);
  }
}
