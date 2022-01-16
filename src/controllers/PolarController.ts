import express, { Request, Response } from "express";
import TrainingZoneService from "../services/TrainingZoneService";
import CompletedTraining from "../entity/CompletedTraining";
import PolarAuthorisation from "../entity/PolarAuthorisation";
import PolarUserData from "../entity/PolarUserData";
import User from "../entity/User";
import IRoutableController from "../interfaces/IRoutableController";
import CompletedTrainingService from "../services/CompletedTrainingService";
import PolarAuthorisationService from "../services/PolarAuthorisationService";
import PolarTrainingService from "../services/PolarTrainingService";
import PolarUserDataService from "../services/PolarUserDataService";
import UserService from "../services/UserService";
import TrainingZone from "../entity/TrainingZone";
import {
  tranferPolarTrainingToCompletedTraining,
} from "../helpers/PolarUtils";


class PolarController implements IRoutableController {
  public path: string = "/polar";
  public router: express.Router = express.Router();
  private PolarUserDataService: PolarUserDataService;
  private PolarAuthorisationService: PolarAuthorisationService;
  private UserService: UserService;
  private CompletedTrainingService: CompletedTrainingService;
  private TrainingZoneService: TrainingZoneService;

  constructor(
    polarUserDataService: PolarUserDataService,
    polarAuthorisationService: PolarAuthorisationService,
    userService: UserService,
    completedTrainingService: CompletedTrainingService,
    trainingZoneService: TrainingZoneService
  ) {
    this.PolarAuthorisationService = polarAuthorisationService;
    this.PolarUserDataService = polarUserDataService;
    this.UserService = userService;
    this.CompletedTrainingService = completedTrainingService;
    this.TrainingZoneService = trainingZoneService;
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(this.path + "/auth", this.polarLogin.bind(this));
    this.router.get(
      this.path + "/pull/:polarUserId",
      this.CheckForNewData.bind(this)
    );
    this.router.get(
      "/auth/authorisationcode",
      this.polarRegisterUser.bind(this)
    );

    this.router.delete(
      this.path + "/users/:userId",
      this.disconnectPolarAccount.bind(this)
    );

    this.router.post(this.path + "/webhook", this.IncomingWebHook.bind(this));
  }

  async polarLogin(req: Request, res: Response) {
    const user: User = await this.UserService.getById(
      req.query.user.toString(),
      { relations: ["polarUserData"] }
    );

    res.redirect(
      "https://flow.polar.com/oauth2/authorization?response_type=code&client_id=cc84107f-03cf-4b81-a3a3-78e975299e59&state=" +
        req.query.user
     
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

    res.redirect(process.env.FRONTEND_URL);
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

  async IncomingWebHook(req: Request, res: Response) {
    // console.log("GOT INFO", req.body);
    // const polaruser = await this.PolarAuthorisationService.find({
    //   where: {
    //     xUserId: req.body.user_id,
    //   },
    // });
    // const newTrainings = await this.checkForNewAvailableTrainings(
    //   req.body.user_id
    // );
    // const completedTrainings =
    //   newTrainings &&
    //   newTrainings.map((training) =>
    //     this.tranferPolarTrainingToCompletedTraining(training, polaruser)
    //   );
    // console.log(completedTrainings);
    // // tslint:disable-next-line: no-unused-expression
    // completedTrainings &&
    //   completedTrainings.forEach(async (completedTraining) => {
    //     await this.CompletedTrainingService.insert(completedTraining);
    //   });
    return res.status(200).send("OK");
  }

  async CheckForNewData(req: Request, res: Response) {
    const { polarUserId } = req.params;
    const polaruser = await this.PolarAuthorisationService.find({
      where: {
        xUserId: polarUserId,
      },
    });

    const polarUserTrainingZones = await this.TrainingZoneService.findMany({
      where: {
        athletes: {
          id: polaruser.user.id,
        },
      },
    });

    // const newTrainings = await this.checkForNewAvailableTrainings(polarUserId);
    const availableTrainings = await PolarTrainingService.checkAvailableTrainings();
    if (availableTrainings) {
      // start transaction
      const transactionResourceUri = await PolarTrainingService.setupTransaction(
        availableTrainings,
        polaruser.accessToken
      );
      // list trainings
      const exerciseUrls = await PolarTrainingService.getAvailableTrainingUrls(
        transactionResourceUri,
        polaruser.accessToken
      );

      // fetchTrainingFromUrls
      const polarTrainings = await PolarTrainingService.fetchTrainingFromUrls(
        exerciseUrls,
        polaruser.accessToken
      );

      const completedTrainings = polarTrainings.map((training) =>
        tranferPolarTrainingToCompletedTraining(
          training,
          polaruser,
          polarUserTrainingZones
        )
      );

      await Promise.all(
        completedTrainings.map(async (completedTraining) => {
          await this.CompletedTrainingService.insert(completedTraining);
        })
      );

      // commitTransaction
      // await PolarTrainingService.completeTransaction(
      //   transactionResourceUri,
      //   polaruser.accessToken
      // );

      return res.status(200).send(completedTrainings);
    } else {
      return res.status(200).send([]);
    }
  }
}

export default new PolarController(
  new PolarUserDataService(PolarUserData),
  new PolarAuthorisationService(PolarAuthorisation),
  new UserService(User),
  new CompletedTrainingService(CompletedTraining),
  new TrainingZoneService(TrainingZone)
);
