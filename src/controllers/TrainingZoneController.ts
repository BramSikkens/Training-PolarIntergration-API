import IRoutableController from "../interfaces/IRoutableController";
import express, { Request, Response } from "express";
import TrainingZoneService from "../services/TrainingZoneService";
import TrainingZone from "../entity/TrainingZone";

class TrainingZoneController implements IRoutableController {
  public path: string = "/TrainingZones";
  public router: express.Router = express.Router();
  private TrainingZoneService: TrainingZoneService;

  constructor(trainingzoneService: TrainingZoneService) {
    this.TrainingZoneService = trainingzoneService;
    this.initializeRoutes();
    this.createTrainingZone = this.createTrainingZone.bind(this);
    this.deleteTrainingZone = this.deleteTrainingZone.bind(this);
    this.updateTrainingZone = this.updateTrainingZone.bind(this);
    this.getTrainingZoneById = this.getTrainingZoneById.bind(this);
  }

  initializeRoutes(): void {
    this.router.post(this.path, this.createTrainingZone.bind(this));
    this.router.delete(
      this.path + "/:TrainingZoneId",
      this.deleteTrainingZone.bind(this)
    );
    this.router.get(
      this.path + "/:TrainingZoneId",
      this.getTrainingZoneById.bind(this)
    );
    this.router.put(
      this.path + "/:TrainingZoneId",
      this.updateTrainingZone.bind(this)
    );
  }

  async createTrainingZone(req: Request, res: Response) {
    const response = await this.TrainingZoneService.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deleteTrainingZone(req: Request, res: Response) {
    const { TrainingZoneId } = req.params;
    const response = await this.TrainingZoneService.remove(TrainingZoneId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response);
  }

  async updateTrainingZone(req: Request, res: Response) {
    const { TrainingZoneId } = req.params;
    const response = await this.TrainingZoneService.update(
      TrainingZoneId,
      req.body
    );
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async getTrainingZoneById(req: Request, res: Response) {
    const { TrainingZoneId } = req.params;
    const response = await this.TrainingZoneService.getById(TrainingZoneId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
}

export default new TrainingZoneController(
  new TrainingZoneService(TrainingZone)
);
