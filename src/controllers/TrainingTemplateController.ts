import IRoutableController from "../interfaces/IRoutableController";
import express, { Request, Response } from "express";
import TrainingTemplateService from "../services/TrainingTemplateService";
import TrainingTemplate from "../entity/TrainingTemplate";
import AthleteService from "../services/AthleteService";
import Athlete from "../entity/Athlete";

class TrainingTemplateController implements IRoutableController {
  public path: string = "/training/templates";
  public router: express.Router = express.Router();
  private trainingTemplateService: TrainingTemplateService;
  constructor(trainingTemplateService: TrainingTemplateService) {
    this.trainingTemplateService = trainingTemplateService;

    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.post(this.path, this.createTrainingTemplate.bind(this));

    this.router.get(this.path, this.getTrainingTemplatesFromOwner.bind(this));

    this.router.delete(
      this.path + "/:trainingTemplateId",
      this.deleteTrainingTemplate.bind(this)
    );
    this.router.get(
      this.path + "/:trainingTemplateId",
      this.getTrainingTemplateById.bind(this)
    );

    this.router.put(
      this.path + "/:trainingTemplateId",
      this.updateTrainingTemplate.bind(this)
    );
  }

  // NAKIJKEN!
  async createTrainingTemplate(req: Request, res: Response) {
    const response = await this.trainingTemplateService.insert(req.body);
    response.trainingData = JSON.parse(response.trainingData);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deleteTrainingTemplate(req: Request, res: Response) {
    const { trainingTemplateId } = req.params;
    const response = await this.trainingTemplateService.remove(
      trainingTemplateId
    );
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(trainingTemplateId);
  }

  async updateTrainingTemplate(req: Request, res: Response) {
    const { trainingTemplateId } = req.params;
    const response = await this.trainingTemplateService.update(
      trainingTemplateId,
      req.body
    );
    if (response.error) return res.status(response.statusCode).send(response);
    response.trainingData = JSON.parse(response.trainingData);
    return res.status(201).send(response);
  }

  async getTrainingTemplateById(req: Request, res: Response) {
    const { trainingTemplateId } = req.params;
    const response = await this.trainingTemplateService.getById(
      trainingTemplateId
    );
    if (response.error) return res.status(response.statusCode).send(response);
    response.trainingData = JSON.parse(response.trainingData);
    return res.status(201).send(response);
  }
  async getTrainingTemplatesFromOwner(req: Request, res: Response) {
    const { ownerId } = req.params;
    const response = await this.trainingTemplateService.getAll({});
    if (response.error) return res.status(response.statusCode).send(response);
    response.multipleItems.map((template) => {
      template.trainingData = JSON.parse(template.trainingData);
    });
    return res.status(201).send(response.multipleItems);
  }
}

export default new TrainingTemplateController(
  new TrainingTemplateService(TrainingTemplate)
);
