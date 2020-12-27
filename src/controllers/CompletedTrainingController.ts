import express, { Request, Response } from "express";
import CompletedTraining from "../entity/CompletedTraining";
import IRoutableController from "../interfaces/IRoutableController";
import CompletedTrainingService from "../services/CompletedTrainingService";
import Athlete from "../entity/Athlete";
import AthleteService from "../services/AthleteService";

class CompletedTrainingController implements IRoutableController {
  public path: string = "/completedTrainings";
  public router: express.Router = express.Router();
  private completedTrainingService: CompletedTrainingService;
  private athleteService: AthleteService;

  constructor(
    completedTrainingService: CompletedTrainingService,
    athleteService: AthleteService
  ) {
    this.completedTrainingService = completedTrainingService;
    this.athleteService = athleteService;
    this.initializeRoutes();
    this.createCompletedTraining = this.createCompletedTraining.bind(this);
    this.deleteCompletedTraining = this.deleteCompletedTraining.bind(this);
    this.updateCompletedTraining = this.updateCompletedTraining.bind(this);
    this.getCompletedTrainingById = this.getCompletedTrainingById.bind(this);
    this.getCompletedTrainingFromAthletes = this.getCompletedTrainingFromAthletes.bind(
      this
    );
  }

  initializeRoutes(): void {
    this.router.get(
      this.path + "/athletes/:athleteId",
      this.getCompletedTrainingFromAthletes.bind(this)
    );
    this.router.post(this.path, this.createCompletedTraining.bind(this));
    this.router.delete(
      this.path + "/:completedTrainingId",
      this.deleteCompletedTraining.bind(this)
    );
    this.router.get(
      this.path + "/:completedTrainingId",
      this.getCompletedTrainingById.bind(this)
    );
    this.router.put(
      this.path + "/:completedTrainingId",
      this.updateCompletedTraining.bind(this)
    );
  }

  async createCompletedTraining(req: Request, res: Response) {
    const completedTraining = req.body;

    if (req.body.athlete) {
      const athlete: Athlete = await this.athleteService.getById(
        req.body.athlete
      );
      completedTraining.athlete = athlete;
    }

    const response = await this.completedTrainingService.insert(
      completedTraining
    );
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deleteCompletedTraining(req: Request, res: Response) {
    const { completedTrainingId } = req.params;
    const response = await this.completedTrainingService.remove(
      completedTrainingId
    );
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response);
  }

  async updateCompletedTraining(req: Request, res: Response) {
    const { completedTrainingId } = req.params;
    const response = await this.completedTrainingService.update(
      completedTrainingId,
      req.body
    );
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async getCompletedTrainingById(req: Request, res: Response) {
    const { completedTrainingId } = req.params;
    const response = await this.completedTrainingService.getById(
      completedTrainingId,
      {
        relations: ["athlete"],
      }
    );
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async getCompletedTrainingFromAthletes(req: Request, res: Response) {

    try {
      const completedTrainings = await this.completedTrainingService.findMany({
        where: {
          athlete: {
            id: req.params.athleteId,
          },
        },
      });


      return res.status(201).send(completedTrainings);
    } catch (error) {
      return error;
    }
  }
}

export default new CompletedTrainingController(
  new CompletedTrainingService(CompletedTraining),
  new AthleteService(Athlete)
);
