import IRoutableController from "../interfaces/IRoutableController";
import express, { Request, Response } from "express";
import DailyMetricService from "../services/DailyMetricService";
import DailyMetric from "../entity/DailyMetric";
import { In } from "typeorm";

class DailyMetricController implements IRoutableController {
  public path: string = "/DailyMetrics";
  public router: express.Router = express.Router();
  private DailyMetricService: DailyMetricService;

  constructor(dailymetricService: DailyMetricService) {
    this.DailyMetricService = dailymetricService;
    this.initializeRoutes();
    this.createDailyMetric = this.createDailyMetric.bind(this);
    this.deleteDailyMetric = this.deleteDailyMetric.bind(this);
    this.updateDailyMetric = this.updateDailyMetric.bind(this);
    this.getDailyMetricById = this.getDailyMetricById.bind(this);
    this.getdailyMetricsFromUsers = this.getdailyMetricsFromUsers.bind(this);
  }

  initializeRoutes(): void {
    this.router.post(this.path, this.createDailyMetric.bind(this));
    this.router.get(
      this.path + "/users",
      this.getdailyMetricsFromUsers.bind(this)
    );
    this.router.delete(
      this.path + "/:DailyMetricId",
      this.deleteDailyMetric.bind(this)
    );
    this.router.get(
      this.path + "/:DailyMetricId",
      this.getDailyMetricById.bind(this)
    );
    this.router.put(
      this.path + "/:DailyMetricId",
      this.updateDailyMetric.bind(this)
    );
  }

  async createDailyMetric(req: Request, res: Response) {
    const response = await this.DailyMetricService.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deleteDailyMetric(req: Request, res: Response) {
    const { DailyMetricId } = req.params;
    const response = await this.DailyMetricService.remove(DailyMetricId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(DailyMetricId);
  }

  async updateDailyMetric(req: Request, res: Response) {
    const { DailyMetricId } = req.params;
    const response = await this.DailyMetricService.update(
      DailyMetricId,
      req.body
    );

    if (response.error) return res.status(response.statusCode).send(response);

    return res.status(201).send(req.body);
  }

  async getDailyMetricById(req: Request, res: Response) {
    const { DailyMetricId } = req.params;
    const response = await this.DailyMetricService.getById(DailyMetricId, {
      relations: ["athlete"],
    });
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async getdailyMetricsFromUsers(req: Request, res: Response) {
    // tslint:disable-next-line: one-variable-per-declaration
    const userIds = new Array(req.query.userIds);
    console.log(userIds);
    const response = await this.DailyMetricService.getAll({
      where: {
        athlete: { id: In(userIds) },
      },
      relations: ["athlete"],
    });

    return res.status(201).send(response.multipleItems);
  }
}

export default new DailyMetricController(new DailyMetricService(DailyMetric));