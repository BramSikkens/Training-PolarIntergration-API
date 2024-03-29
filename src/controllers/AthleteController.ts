import express, { Request, Response } from "express";
import IRoutableController from "../interfaces/IRoutableController";
import AthleteService from "../services/AthleteService";
import TrainingZoneService from "../services/TrainingZoneService";
import TrainingZone from "../entity/TrainingZone";
import Athlete from "../entity/Athlete";
import DailyMetric from "../entity/DailyMetric";
import DailyMetricService from "../services/DailyMetricService";
import PlannedTrainingService from "../services/PlannedTrainingService";
import PlannedTraining from "../entity/PlannedTraining";

import MacroCycleService from "../services/MacroCycleService";

class AthleteController implements IRoutableController {
  public path: string = "/athletes";
  public router: express.Router = express.Router();
  private athleteService: AthleteService;
  private trainingZoneService: TrainingZoneService;
  private DailyMetricService: DailyMetricService;
  private PlannedTrainingService: PlannedTrainingService;
  private MacroCycleService: MacroCycleService;

  constructor(
    athleteService: AthleteService,
    trainingZoneService: TrainingZoneService,
    dailymetricService: DailyMetricService,
    plannedTrainingService: PlannedTrainingService,

  ) {
    this.trainingZoneService = trainingZoneService;
    this.athleteService = athleteService;
    this.DailyMetricService = dailymetricService;
    this.PlannedTrainingService = plannedTrainingService;

    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(this.path, this.insert.bind(this));
    this.router.post(
      this.path + "/:userId/trainingzones",
      this.addTrainingZoneToAthlete.bind(this)
    );

    this.router.post(
      this.path + "/:userId/dailymetrics/:metricId",
      this.addDailyMetricToAthlete.bind(this)
    );



    this.router.get(this.path + "/:userid", this.getAthleteById.bind(this));
    this.router.get(
      this.path + "/:userId/trainingzones",
      this.getUserTrainingzones.bind(this)
    );
    this.router.delete(this.path + "/:userId", this.delete.bind(this));
    this.router.delete(
      this.path + "/userId/trainingzones/:trainingZoneId",
      this.removeTrainingZoneFromUser.bind(this)
    );

    this.router.delete(
      this.path + "/userId/dailymetrics/:metricId",
      this.removeDailyMetricFromUser.bind(this)
    );
    this.router.put(this.path + "/:userId", this.updateAthlete.bind(this));
  }

  async getAthleteById(req: Request, res: Response): Promise<any> {
    const { userid } = req.params;
    const response = await this.athleteService.getById(userid, {
      relations: ["completedTrainings", "plannedTrainings", "trainingZones","macroCycles"],
    });
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async insert(req: Request, res: Response): Promise<Response<any>> {
    const response = await this.athleteService.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async delete(req: Request, res: Response): Promise<Response<any>> {
    const { userId } = req.params;
    const response = await this.athleteService.remove(userId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response);
  }

  async updateAthlete(req: Request, res: Response): Promise<Response<any>> {
    const { userId } = req.params;
    const response = await this.athleteService.update(userId, req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async addTrainingZoneToAthlete(req: any, res: any) {
    console.log("ok");
    const { userId } = req.params;

    const user: Athlete = await this.athleteService.getById(userId, {
      relations: ["trainingZones"],
    });

    if (!user.trainingZones) {
      user.trainingZones = [];
    }

    if (Array.isArray(req.body)) {
      req.body.forEach((trainingZone: TrainingZone) => {
        user.trainingZones.push(trainingZone);
      });
    } else {
      user.trainingZones.push(req.body as TrainingZone);
    }

    const insertResult = await this.athleteService.insert(user);
    res.status(200).send(insertResult);
  }

  async removeTrainingZoneFromUser(req: Request, res: Response) {
    const { trainingZoneId, userId } = req.params;
    const trainingZone: TrainingZone = await this.trainingZoneService.getById(
      trainingZoneId
    );

    const user: Athlete = await this.athleteService.getById(userId, {
      relations: ["trainingZones"],
    });

    user.events = user.events.filter(
      (item) => item.id.toString() !== trainingZoneId
    );

    await this.athleteService.insert(user);
  }

  async addDailyMetricToAthlete(req: any, res: any) {
    const { metricId, userId } = req.params;
    const metric: DailyMetric = await this.DailyMetricService.getById(metricId);

    const user: Athlete = await this.athleteService.getById(userId, {
      relations: ["dailyMetrics"],
    });
    if (!user.dailyMetrics) {
      user.dailyMetrics = [];
    }

    user.dailyMetrics.push(metric);
    await this.athleteService.insert(user);
  }

  async removeDailyMetricFromUser(req: Request, res: Response) {
    const { metricId, userId } = req.params;
    const dailyMetric: DailyMetric = await this.DailyMetricService.getById(
      metricId
    );

    const user: Athlete = await this.athleteService.getById(userId, {
      relations: ["dailyMetrics"],
    });

    user.dailyMetrics = user.dailyMetrics.filter(
      (item) => item.id.toString() !== metricId
    );
    await this.athleteService.insert(user);
  }

  async getUserTrainingzones(req: Request, res: Response) {
    const { userId } = req.params;
    const athlete: Athlete = await this.athleteService.getById(userId, {
      relations: ["trainingZones"],
    });
    return res.status(200).send(athlete.trainingZones);
  }


}

export default new AthleteController(
  new AthleteService(Athlete),
  new TrainingZoneService(TrainingZone),
  new DailyMetricService(DailyMetric),
  new PlannedTrainingService(PlannedTraining)
);
