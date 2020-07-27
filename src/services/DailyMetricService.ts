import DailyMetric from "../entity/DailyMetric";
import BaseService from "./BaseService";

export default class DailyMetricService extends BaseService<DailyMetric> {
  constructor(model: any) {
    super(model);
  }
}
