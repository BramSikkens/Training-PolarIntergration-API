import express, { Request, Response } from "express";
import ErrorDTO from "../DTO/ErrorDTO";
import Trainer from "../entity/Trainer";
import IRoutableController from "../interfaces/IRoutableController";
import TrainerService from "../services/TrainerService";
import { mapToTrainerDTO } from "../helpers/Mappers";

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
    this.deleteTrainer = this.deleteTrainer.bind(this);
    this.getTeamsOfTrainer = this.getTeamsOfTrainer.bind(this);
  }

  public initializeRoutes(): void {
    this.router.get(
      this.path + "/:userId/teams",
      this.getTeamsOfTrainer.bind(this)
    );
    this.router.get(this.path + "/:userid", this.getTrainerById.bind(this));
    this.router.post(this.path, this.createTrainer.bind(this));
    this.router.put(this.path + "/:userId", this.createTrainer.bind(this));
    this.router.delete(this.path + "/:userId", this.deleteTrainer.bind(this));
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
    console.log(userid);
    try {
      const serviceResponse = await this.trainerService.getById(userid, {
        relations: ["teams"],
      });
      console.log(serviceResponse);
      if ((serviceResponse as Trainer).teams) {
        const returnObject = mapToTrainerDTO(serviceResponse);
        return res.status(200).send(returnObject);
      } else if ((serviceResponse as ErrorDTO).message) {
        return res
          .status((serviceResponse as ErrorDTO).statusCode)
          .send(serviceResponse);
      }
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async getTeamsOfTrainer(req: Request, res: Response): Promise<any> {
    const { userId } = req.params;
    try {
      const serviceResponse = await this.trainerService.getById(userId, {
        relations: ["teams"],
      });

      if ((serviceResponse as Trainer).teams) {
        return res.status(200).send(serviceResponse.teams);
      } else if ((serviceResponse as ErrorDTO).message) {
        return res
          .status((serviceResponse as ErrorDTO).statusCode)
          .send(serviceResponse);
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

export default new TrainerController(new TrainerService(Trainer));
