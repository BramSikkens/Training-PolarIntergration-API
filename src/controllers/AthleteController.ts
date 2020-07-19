import express, { Request, Response } from "express";
import Athlete from "../entity/Athlete";
import IRoutableController from "../interfaces/IRoutableController";
import AthleteService from "../services/AthleteService";

class AthleteController implements IRoutableController {
  public path: string = "/athletes";
  public router: express.Router = express.Router();
  private athleteService: AthleteService;

  constructor(athleteService: AthleteService) {
    this.athleteService = athleteService;
    this.initializeRoutes();
    this.getAthleteById = this.getAthleteById.bind(this);
    this.delete = this.delete.bind(this);
    this.insert = this.insert.bind(this);
    this.updateAthlete = this.updateAthlete.bind(this);
  }

  public initializeRoutes(): void {
    this.router.post(this.path, this.insert.bind(this));
    this.router.get(this.path + "/:userid", this.getAthleteById.bind(this));
    this.router.delete(this.path + "/:userId", this.delete.bind(this));
    this.router.put(this.path + "/:userId", this.updateAthlete.bind(this));
  }

  async getAthleteById(req: Request, res: Response): Promise<any> {
    const { userid } = req.params;
    const response = await this.athleteService.getById(userid);
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
}

export default new AthleteController(new AthleteService(Athlete));
