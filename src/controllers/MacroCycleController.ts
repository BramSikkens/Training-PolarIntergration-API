import express, { Request, Response } from "express";
import { MacroCycle } from "../entity/MacroCycle";
import IRoutableController from "../interfaces/IRoutableController";
import MacroCycleService from "../services/MacroCycleService";

class MacroCycleController implements IRoutableController {
  public path: string = "/macrocycles";
  public router: express.Router = express.Router();
  private macrocycleService: MacroCycleService;

  constructor(macrocycleService: MacroCycleService) {
    this.macrocycleService = macrocycleService;
    this.initializeRoutes();
    this.createMacroCycle = this.createMacroCycle.bind(this);
    this.deleteMacroCycle = this.deleteMacroCycle.bind(this);
    this.updateMacroCycle = this.updateMacroCycle.bind(this);
    this.getMacroCycleById = this.getMacroCycleById.bind(this);
  }

  initializeRoutes(): void {
    this.router.post(this.path, this.createMacroCycle.bind(this));
    this.router.delete(
      this.path + "/:macrocycleId",
      this.deleteMacroCycle.bind(this)
    );
    this.router.get(
      this.path + "/:macrocycleId",
      this.getMacroCycleById.bind(this)
    );
    this.router.put(
      this.path + "/:macrocycleId",
      this.updateMacroCycle.bind(this)
    );
  }

  async createMacroCycle(req: Request, res: Response) {
    const response = await this.macrocycleService.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deleteMacroCycle(req: Request, res: Response) {
    const { macrocycleId } = req.params;
    const response = await this.macrocycleService.remove(macrocycleId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response);
  }

  async updateMacroCycle(req: Request, res: Response) {
    const { macrocycleId } = req.params;
    const response = await this.macrocycleService.update(
      macrocycleId,
      req.body
    );
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async getMacroCycleById(req: Request, res: Response) {
    const { macrocycleId } = req.params;
    const response = await this.macrocycleService.getById(macrocycleId, {
      relations: ["mesoCycles"],
    });
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
}

export default new MacroCycleController(new MacroCycleService(MacroCycle));
