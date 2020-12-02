import express, { Request, Response } from "express";
import { MesoCycle } from "../entity/MesoCycle";
import MacroCycle from "../entity/MacroCycle";
import IRoutableController from "../interfaces/IRoutableController";
import MacroCycleService from "../services/MacroCycleService";

class MacroCycleController implements IRoutableController {
  public path: string = "/macrocycles";
  public router: express.Router = express.Router();
  private macrocycleService: MacroCycleService;

  constructor(macrocycleService: MacroCycleService) {
    this.macrocycleService = macrocycleService;
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.get(
      this.path + "/teams/:teamId",
      this.getMacroCyclesFromTeam.bind(this)
    );
    this.router.post(this.path, this.createMacroCycle.bind(this));
    this.router.delete(
      this.path + "/:macrocycleId",
      this.deleteMacroCycle.bind(this)
    );

    this.router.get(
      this.path + "/:macrocycleId/microcycles",
      this.getAllMicrosFromMacro.bind(this)
    );

    this.router.post(
      this.path + "/:macrocycleId/mesocycles",
      this.addMesoToMacro.bind(this)
    );

    this.router.get(
      this.path + "/:macrocycleId/mesos",
      this.getMesosOfMacro.bind(this)
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
    return res.status(200).send(macrocycleId);
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

  async getMacroCyclesFromTeam(req: Request, res: Response) {
    console.log(req.query.teamId);

    const cycles = await this.macrocycleService.findMany({
      where: {
        team: { id: req.params.teamId },
      },
    });

    return res.status(201).send(cycles);
  }

  async getMesosOfMacro(req: Request, res: Response) {
    const { macrocycleId } = req.params;

    const response = await this.macrocycleService.getById(macrocycleId, {
      relations: ["mesoCycles"],
    });
    return res.status(201).send(response.mesoCycles);
  }

  async addMesoToMacro(req: Request, res: Response) {
    const { macrocycleId } = req.params;
    const mesoCycle: MesoCycle = req.body;
    const macroCycle = await this.macrocycleService.getById(macrocycleId, {
      relations: ["mesoCycles"],
    });

    if (macroCycle.mesoCycles == null) {
      macroCycle.mesoCycles = [];
    }

    macroCycle.mesoCycles.push(mesoCycle);
    await this.macrocycleService.insert(macroCycle);
    return res.status(200).send(mesoCycle);
  }

  async getAllMicrosFromMacro(req: Request, res: Response) {
    const { macrocycleId } = req.params;
    const response = await this.macrocycleService.getById(macrocycleId, {
      relations: ["mesoCycles"],
    });
    if (response.error) return res.status(response.statusCode).send(response);

    const micros: any = [];
    response.mesoCycles.forEach((meso: any) => {
      meso.microcycles.forEach((micro: any) => {
        micros.push(micro);
      });
    });

    return res.status(201).send(micros);
  }
}

export default new MacroCycleController(new MacroCycleService(MacroCycle));
