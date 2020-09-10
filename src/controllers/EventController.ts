import express, { Request, Response } from "express";
import Event from "../entity/Event";
import IRoutableController from "../interfaces/IRoutableController";
import EventService from "../services/EventService";
import { In } from "typeorm";

class EventController implements IRoutableController {
  public path: string = "/events";
  public router: express.Router = express.Router();
  private eventService: EventService;

  constructor(eventService: EventService) {
    this.eventService = eventService;
    this.initializeRoutes();
    this.createEvent = this.createEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.getEventById = this.getEventById.bind(this);
    this.getEventsFromUsers = this.getEventsFromUsers.bind(this);
    this.updateFull = this.updateFull.bind(this);
  }

  initializeRoutes(): void {
    this.router.get(this.path + "/users", this.getEventsFromUsers.bind(this));
    this.router.post(this.path, this.createEvent.bind(this));
    this.router.delete(this.path + "/:eventId", this.deleteEvent.bind(this));
    this.router.get(this.path + "/:eventId", this.getEventById.bind(this));
    this.router.put(this.path + "/:eventId", this.updateEvent.bind(this));
    this.router.put(this.path + "/:eventId/full", this.updateFull.bind(this));
  }

  async createEvent(req: Request, res: Response) {
    const response = await this.eventService.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    console.log(response);
    return res.status(201).send(response);
  }

  async deleteEvent(req: Request, res: Response) {
    const { eventId } = req.params;
    const response = await this.eventService.remove(eventId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(eventId);
  }

  async updateEvent(req: Request, res: Response) {
    const { eventId } = req.params;
    const response = await this.eventService.update(eventId, req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async getEventById(req: Request, res: Response) {
    const { eventId } = req.params;
    const response = await this.eventService.getById(eventId, {
      relations: ["users"],
    });
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async getEventsFromUsers(req: Request, res: Response) {
    // tslint:disable-next-line: one-variable-per-declaration

    try {
      const events = await this.eventService.getEventsOfUser(req.query.userIds);
      return res.status(201).send(events);
    } catch (error) {
      return error;
    }
  }

  async updateFull(req: Request, res: Response) {
    const { eventId } = req.params;
    const response = await this.eventService.updateEventFull(eventId, req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
}

export default new EventController(new EventService(Event));
