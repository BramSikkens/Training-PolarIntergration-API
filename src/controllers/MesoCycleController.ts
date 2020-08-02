import express, { Request, Response } from "express";
import { MesoCycle } from "../entity/MesoCycle";
import IRoutableController from "../interfaces/IRoutableController";
import MesoCycleService from "../services/MesoCycleService";

class MesoCycleController implements IRoutableController {
  public path: string = "/Mesocycles";
  public router: express.Router = express.Router();
  private mesocycleService: MesoCycleService;

  constructor(mesocycleService: MesoCycleService) {
    this.mesocycleService = mesocycleService;
    this.initializeRoutes();
    this.createMesoCycle = this.createMesoCycle.bind(this);
    this.deleteMesoCycle = this.deleteMesoCycle.bind(this);
    this.updateMesoCycle = this.updateMesoCycle.bind(this);
    this.getMesoCycleById = this.getMesoCycleById.bind(this);
  }

  initializeRoutes(): void {
    this.router.post(this.path, this.createMesoCycle.bind(this));
    this.router.delete(
      this.path + "/:mesocycleId",
      this.deleteMesoCycle.bind(this)
    );
    this.router.get(
      this.path + "/:mesocycleId",
      this.getMesoCycleById.bind(this)
    );
    this.router.put(
      this.path + "/:mesocycleId",
      this.updateMesoCycle.bind(this)
    );
  }

  async createMesoCycle(req: Request, res: Response) {
    const response = await this.mesocycleService.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deleteMesoCycle(req: Request, res: Response) {
    const { MesocycleId } = req.params;
    const response = await this.mesocycleService.remove(MesocycleId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response);
  }

  async updateMesoCycle(req: Request, res: Response) {
    const { MesocycleId } = req.params;
    const response = await this.mesocycleService.update(MesocycleId, req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async getMesoCycleById(req: Request, res: Response) {
    const { MesocycleId } = req.params;
    const response = await this.mesocycleService.getById(MesocycleId, {
      relations: ["users"],
    });
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
}

export default new MesoCycleController(new MesoCycleService(MesoCycle));
