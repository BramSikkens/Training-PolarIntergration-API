import IBaseService from "../Interfaces/IBaseService";
import { Response, Request } from "express";
import BaseService from "../services/BaseService";
import express from "express";

export default abstract class BaseController {
  public service: IBaseService;
  public router = express.Router();

  constructor(service: IBaseService) {
    this.service = service;
    this.insert = this.insert.bind(this);
  }

  async insert(req: Request, res: Response): Promise<Response<any>> {
    const response = await this.service.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
}
