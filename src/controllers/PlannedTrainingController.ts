import IRoutableController from "../interfaces/IRoutableController";
import express, { Request, Response } from "express";
import PlannedTrainingService from "../services/PlannedTrainingService";
import PlannedTraining from "../entity/PlannedTraining";
import AthleteService from "../services/AthleteService";
import Athlete from "../entity/Athlete";

class PlannedTrainingController implements IRoutableController {
  public path: string = "/plannedtrainings";
  public router: express.Router = express.Router();
  private plannedTrainingService: PlannedTrainingService;
  private athleteService: AthleteService;
  constructor(
    plannedTrainingService: PlannedTrainingService,
    athleteService: AthleteService
  ) {
    this.plannedTrainingService = plannedTrainingService;
    this.athleteService = athleteService;
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.post(this.path, this.createPlannedTraining.bind(this));
    this.router.delete(
      this.path + "/:plannedTrainingId",
      this.deletePlannedTraining.bind(this)
    );
    this.router.get(
      this.path + "/:plannedTrainingId",
      this.getPlannedTrainingById.bind(this)
    );
    this.router.put(
      this.path + "/:plannedTrainingId",
      this.updatePlannedTraining.bind(this)
    );
  }

  //NAKIJKEN!
  async createPlannedTraining(req: Request, res: Response) {
    const plannedTraining = req.body;
    const athleteArray = [];

    if (req.body.athletes) {
      // Adding athletes
      for (const athleteId of plannedTraining.athletes) {
        const athlete: Athlete = await this.athleteService.getById(athleteId);
        athleteArray.push(athlete);
      }
    }

    plannedTraining.athletes = athleteArray;
    console.log(plannedTraining);

    const response = await this.plannedTrainingService.insert(plannedTraining);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deletePlannedTraining(req: Request, res: Response) {
    const { plannedTrainingId } = req.params;
    const response = await this.plannedTrainingService.remove(
      plannedTrainingId
    );
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response);
  }

  async updatePlannedTraining(req: Request, res: Response) {
    const { plannedTrainingId } = req.params;
    const response = await this.plannedTrainingService.update(
      plannedTrainingId,
      req.body
    );
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async getPlannedTrainingById(req: Request, res: Response) {
    const { plannedTrainingId } = req.params;
    const response = await this.plannedTrainingService.getById(
      plannedTrainingId,
      {
        relations: ["athletes"],
      }
    );
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
}

export default new PlannedTrainingController(
  new PlannedTrainingService(PlannedTraining),
  new AthleteService(Athlete)
);
