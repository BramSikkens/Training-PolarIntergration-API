import axios from "axios";
import express, { Request, Response } from "express";
import qs from "qs";
import User from "../entity/User";
import UserService from "../services/UserService";
import PolarAuthorisation from "../entity/PolarAuthorisation";
import PolarUserData from "../entity/PolarUserData";
import IRoutableController from "../interfaces/IRoutableController";
import PolarAuthorisationService from "../services/PolarAuthorisationService";
import PolarUserDataService from "../services/PolarUserDataService";
import { use } from "passport";

class PolarController implements IRoutableController {
  public path: string = "/polar";
  public router: express.Router = express.Router();
  private PolarUserDataService: PolarUserDataService;
  private PolarAuthorisationService: PolarAuthorisationService;
  private UserService: UserService;

  constructor(
    polarUserDataService: PolarUserDataService,
    polarAuthorisationService: PolarAuthorisationService,
    userService: UserService
  ) {
    this.PolarAuthorisationService = polarAuthorisationService;
    this.PolarUserDataService = polarUserDataService;
    this.UserService = userService;
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(this.path + "/auth", this.polarLogin.bind(this));
    this.router.get(
      "/auth/authorisationcode",
      this.polarRegisterUser.bind(this)
    );

    this.router.delete(
      this.path + "/users/:userId",
      this.disconnectPolarAccount.bind(this)
    );
  }

  async polarLogin(req: Request, res: Response) {
    const user: User = await this.UserService.getById(
      req.query.user.toString(),
      { relations: ["polarUserData"] }
    );

    res.redirect(
      "https://flow.polar.com/oauth2/authorization?response_type=code&client_id=cc84107f-03cf-4b81-a3a3-78e975299e59&state=" +
        req.query.user
      // SECRET f63cfae8-4a9f-42ab-9dc1-66eaafbbd6c5
    );
  }

  async polarRegisterUser(req: Request, res: Response) {
    // Get AUTH CODE
    const polarAuthorisationCode = req.query.code;
    const user: User = await this.UserService.getById(
      req.query.state.toString(),
      { relations: ["polarUserData"] }
    );
    const token: PolarAuthorisation = await this.PolarAuthorisationService.receiveUserTokenFromPolar(
      polarAuthorisationCode.toString()
    );

    user.polarAuthorisation = token;

    const registerUser: PolarUserData = await this.PolarUserDataService.registerUserWithPolar(
      token.xUserId.toString(),
      token.accessToken
    );

    user.polarUserData = registerUser;

    await this.UserService.insert(user);

    res.status(200).send(user);
  }

  async disconnectPolarAccount(req: Request, res: Response) {
    const { userId } = req.params;
    const user: User = await this.UserService.getById(userId, {
      relations: ["polarUserData", "polarAuthorisation"],
    });

    const userDeletedFromPolar = this.PolarUserDataService.deRegisterWithPolar(
      user.polarUserData.polarUserId.toString(),
      user.polarAuthorisation.accessToken
    );

    const polarUserId = user.polarUserData.polarUserId.toString();
    const polarAuthId = user.polarAuthorisation.id;

    user.polarUserData = null;
    user.polarAuthorisation = null;

    const updateUser = await this.UserService.insert(user);

    try {
      const removePolarAuthRes = await this.PolarAuthorisationService.remove(
        polarAuthId
      );
    } catch (err) {
      console.log(err);
    }

    try {
      const removePolarUserData = await this.PolarUserDataService.remove(
        polarUserId
      );
    } catch (err) {
      console.log(err);
    }

    return res.send(user);
  }
}

export default new PolarController(
  new PolarUserDataService(PolarUserData),
  new PolarAuthorisationService(PolarAuthorisation),
  new UserService(User)
);
