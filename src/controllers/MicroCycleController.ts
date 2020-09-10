import express, { Request, Response } from "express";
import { MicroCycle } from "../entity/MicroCycle";
import IRoutableController from "../interfaces/IRoutableController";
import MicroCycleService from "../services/MicroCycleService";

class MicroCycleController implements IRoutableController {
  public path: string = "/Microcycles";
  public router: express.Router = express.Router();
  private microcycleService: MicroCycleService;

  constructor(microcycleService: MicroCycleService) {
    this.microcycleService = microcycleService;
    this.initializeRoutes();
    this.createMicroCycle = this.createMicroCycle.bind(this);
    this.deleteMicroCycle = this.deleteMicroCycle.bind(this);
    this.updateMicroCycle = this.updateMicroCycle.bind(this);
    this.getMicroCycleById = this.getMicroCycleById.bind(this);
  }

  initializeRoutes(): void {
    this.router.post(this.path, this.createMicroCycle.bind(this));
    this.router.delete(
      this.path + "/:microcycleId",
      this.deleteMicroCycle.bind(this)
    );
    this.router.get(
      this.path + "/:microcycleId",
      this.getMicroCycleById.bind(this)
    );
    this.router.put(
      this.path + "/:microcycleId",
      this.updateMicroCycle.bind(this)
    );
  }

  async createMicroCycle(req: Request, res: Response) {
    const response = await this.microcycleService.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deleteMicroCycle(req: Request, res: Response) {
    const { MicrocycleId } = req.params;
    const response = await this.microcycleService.remove(MicrocycleId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response);
  }

  async updateMicroCycle(req: Request, res: Response) {
    const { MicrocycleId } = req.params;
    const response = await this.microcycleService.update(MicrocycleId, req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async getMicroCycleById(req: Request, res: Response) {
    const { MicrocycleId } = req.params;
    const response = await this.microcycleService.getById(MicrocycleId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
}

export default new MicroCycleController(new MicroCycleService(MicroCycle));
