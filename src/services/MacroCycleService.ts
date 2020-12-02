import { getRepository, Repository } from "typeorm";
import MacroCycle from "../entity/MacroCycle";
import BaseService from "./BaseService";

export default class MacroCycleService extends BaseService<MacroCycle> {
  constructor(model: any) {
    super(model);
  }
}
