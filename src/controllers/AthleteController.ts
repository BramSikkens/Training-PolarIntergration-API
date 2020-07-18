import AthleteService from "../services/AthleteService";
import Athlete from "../entity/Athlete";
import express from "express";
import IRoutableController from "../interfaces/IRoutableController";
import { Response, Request } from "express";
import BaseService from "../services/BaseService";

class AthleteController implements IRoutableController {
  public path: string = "/athletes";
  public router: express.Router = express.Router();
  public service: BaseService<Athlete>;

  constructor(service: AthleteService) {
    this.service = service;
    this.initializeRoutes();
    this.getAthleteById = this.getAthleteById.bind(this);
  }

  public initializeRoutes(): void {
    this.router.post(this.path, this.insert);
    this.router.get(this.path + "/:userid", this.getAthleteById.bind(this));
  }

  async getAthleteById(req: Request, res: Response): Promise<any> {
    const { userid } = req.params;
    const response = await this.service.getById(userid);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async insert(req: Request, res: Response): Promise<Response<any>> {
    const response = await this.service.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
}

export default new AthleteController(new AthleteService(Athlete));
