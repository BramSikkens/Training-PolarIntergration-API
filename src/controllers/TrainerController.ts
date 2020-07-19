import express, { Request, Response } from "express";
import Trainer from "../entity/Trainer";
import IRoutableController from "../interfaces/IRoutableController";
import TrainerService from "../services/TrainerService";

class TrainerController implements IRoutableController {
  public path: string = "/trainers";
  public router: express.Router = express.Router();
  public trainerService: TrainerService;

  constructor(service: TrainerService) {
    this.trainerService = service;
    this.initializeRoutes();
    this.getTrainerById = this.getTrainerById.bind(this);
    this.createTrainer = this.createTrainer.bind(this);
    this.updateTrainer = this.updateTrainer.bind(this);
  }

  public initializeRoutes(): void {
    this.router.get(this.path + "/:userid", this.getTrainerById.bind(this));
    this.router.post(this.path + "/:userid/teams/:teamid");
    this.router.post(this.path, this.createTrainer.bind(this));
    this.router.put(this.path + "/:userId", this.createTrainer.bind(this));
  }

  async createTrainer(req: Request, res: Response): Promise<any> {
    const response = await this.trainerService.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async updateTrainer(req: Request, res: Response): Promise<any> {
    const { userId } = req.params;
    const response = await this.trainerService.update(userId, req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deleteTrainer(req: Request, res: Response) {
    const { userId } = req.params;
    const response = await this.trainerService.remove(userId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response);
  }

  async getTrainerById(req: Request, res: Response): Promise<any> {
    const { userid } = req.params;
    const response = await this.trainerService.getById(userid, {
      relations: ["teams"],
    });
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
}

export default new TrainerController(new TrainerService(Trainer));
