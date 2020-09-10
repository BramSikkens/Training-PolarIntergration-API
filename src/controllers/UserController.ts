import IRoutableController from "../interfaces/IRoutableController";
import UserService from "../services/UserService";
import express, { Request } from "express";
import { Response } from "express";
import User from "../entity/User";
import { ReturnUserDto } from "../DTO/RequestDTOs";
import ErrorDTO from "../DTO/ErrorDTO";
import { mapToUserDTO } from "../helpers/Mappers";
import EventService from "../services/EventService";
import Event from "../entity/Event";
import passport from "passport";
import console from "console";

class UserController implements IRoutableController {
  public path: string = "/users";
  public router: express.Router = express.Router();
  private userService: UserService;
  private eventService: EventService;

  constructor(service: UserService, eventService: EventService) {
    this.userService = service;
    this.eventService = eventService;
    this.initializeRoutes();
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.addEventToUser = this.addEventToUser.bind(this);
    this.removeEventFromUser = this.removeEventFromUser.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.loginAccesToken = this.loginAccesToken.bind(this);
  }

  public initializeRoutes(): void {
    this.router.post(this.path, this.create.bind(this));
    this.router.post(
      this.path + "/:userId/events/:eventId",
      this.addEventToUser.bind(this)
    );
    this.router.get(this.path + "/:userid", this.getById.bind(this));
    this.router.delete(this.path + "/:userId", this.delete.bind(this));
    this.router.delete(
      this.path + "/:userId/events/:eventId",
      this.removeEventFromUser.bind(this)
    );
    this.router.put(this.path + "/:userId", this.update.bind(this));
    this.router.post(this.path + "/login", this.login.bind(this));
    this.router.post(this.path + "/register", this.register.bind(this));
    this.router.post(
      this.path + "/login/token",
      this.loginAccesToken.bind(this)
    );
  }

  async create(req: Request, res: Response): Promise<Response<any>> {
    const response = await this.userService.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async update(req: Request, res: Response): Promise<Response<any>> {
    const { userId } = req.params;
    const response = await this.userService.update(userId, req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async delete(req: Request, res: Response): Promise<Response<any>> {
    const { userId } = req.params;
    const response = await this.userService.remove(userId);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response);
  }

  async getById(req: Request, res: Response): Promise<Response<any>> {
    const { userid } = req.params;
    try {
      const serviceResponse = await this.userService.getById(userid);
      if ((serviceResponse as User).username) {
        const returnObject: ReturnUserDto = mapToUserDTO(serviceResponse);
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

  async addEventToUser(req: Request, res: Response) {
    const { eventId, userId } = req.params;
    const event: Event = await this.eventService.getById(eventId);

    const user: User = await this.userService.getById(userId, {
      relations: ["events"],
    });
    if (!user.events) {
      user.events = [];
    }

    user.events.push(event);
    await this.userService.insert(user);
  }

  async removeEventFromUser(req: Request, res: Response) {
    const { eventId, userId } = req.params;
    const event: Event = await this.eventService.getById(eventId);

    const user: User = await this.userService.getById(userId, {
      relations: ["events"],
    });

    user.events = user.events.filter((item) => item.id.toString() !== eventId);
    console.log(user);
    await this.userService.insert(user);
  }

  async login(req: Request, res: Response, next: any) {
    passport.authenticate("login", { session: false }, (err, user) => {
      console.log("ok");
      if (err) {
        return res.status(800).send(err);
      }
      return res.status(200).send(user);
    })(req, res, next);
  }

  async loginAccesToken(req: Request, res: Response, next: any) {
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err) {
        return res.status(800).send(err);
      }
      return res.status(200).send(user);
    })(req, res, next);
  }

  async register(req: Request, res: Response, next: any) {
    passport.authenticate("register", (err, user, info) => {
      console.log(info);
      console.log(user);
    })(req, res, next);
  }
}

export default new UserController(
  new UserService(User),
  new EventService(Event)
);
