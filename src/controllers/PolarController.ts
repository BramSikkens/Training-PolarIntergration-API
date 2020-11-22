import axios from "axios";
import express, { Request, Response } from "express";
import CompletedTraining from "../entity/CompletedTraining";
import PolarAuthorisation from "../entity/PolarAuthorisation";
import PolarUserData from "../entity/PolarUserData";
import User from "../entity/User";
import IRoutableController from "../interfaces/IRoutableController";
import CompletedTrainingService from "../services/CompletedTrainingService";
import PolarAuthorisationService from "../services/PolarAuthorisationService";
import PolarUserDataService from "../services/PolarUserDataService";
import UserService from "../services/UserService";

// WEBHOOK;
// {
//     "data": {
//         "id": "Zye7DWP1",
//         "events": [
//             "EXERCISE"
//         ],
//         "url": "http://4489d5800bb6.ngrok.io/polar/webhook",
//         "signature_secret_key": "131e4c26-7293-48b5-be24-b47606d87c68"
//     }
// }

class PolarController implements IRoutableController {
  public path: string = "/polar";
  public router: express.Router = express.Router();
  private PolarUserDataService: PolarUserDataService;
  private PolarAuthorisationService: PolarAuthorisationService;
  private UserService: UserService;
  private CompletedTrainingService: CompletedTrainingService;

  constructor(
    polarUserDataService: PolarUserDataService,
    polarAuthorisationService: PolarAuthorisationService,
    userService: UserService,
    completedTrainingService: CompletedTrainingService
  ) {
    this.PolarAuthorisationService = polarAuthorisationService;
    this.PolarUserDataService = polarUserDataService;
    this.UserService = userService;
    this.CompletedTrainingService = completedTrainingService;
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
    console.log("GOT INFO", req.body);
    const polaruser = await this.PolarAuthorisationService.find({
      where: {
        xUserId: req.body.user_id,
      },
    });

    const newTrainings = await this.checkForNewAvailableTrainings(
      req.body.user_id
    );
    const completedTrainings =
      newTrainings &&
      newTrainings.map((training) =>
        this.tranferPolarTrainingToCompletedTraining(training)
      );

    console.log(completedTrainings);

    // tslint:disable-next-line: no-unused-expression
    completedTrainings &&
      completedTrainings.forEach(async (completedTraining) => {
        await this.CompletedTrainingService.insert(completedTraining);
      });

    return res.status(200).send("OK");
  }

  async CheckForNewData(req: Request, res: Response) {
    const { polarUserId } = req.params;
    const newTrainings = await this.checkForNewAvailableTrainings(polarUserId);
    if (newTrainings.length === 0) {
      return res.status(200).send("no new trainings");
    }
    const completedTrainings = newTrainings.map((training) =>
      this.tranferPolarTrainingToCompletedTraining(training)
    );

    await Promise.all(
      completedTrainings.map(async (completedTraining) => {
        await this.CompletedTrainingService.insert(completedTraining);
      })
    );

    return res.status(200).send(completedTrainings);
  }

  async checkForNewAvailableTrainings(polarUserId: string) {
    const newTrainings: any[] = [];
    const polaruser = await this.PolarAuthorisationService.find({
      where: {
        xUserId: polarUserId,
      },
    });

    // Check For new Data
    const pullDataRequest = await axios.get(
      "https://www.polaraccesslink.com/v3/notifications",
      {
        headers: {
          Authorization:
            "Basic Y2M4NDEwN2YtMDNjZi00YjgxLWEzYTMtNzhlOTc1Mjk5ZTU5OmY2M2NmYWU4LTRhOWYtNDJhYi05ZGMxLTY2ZWFhZmJiZDZjNQ==",
        },
      }
    );

    // CHECK FOR EXERCISES
    const availableTrainings = await pullDataRequest.data[
      "available-user-data"
    ].filter((data: any) => data["data-type"] === "EXERCISE")[0];

    // IF EXERCISES
    if (availableTrainings) {
      // Create Transaction
      try {
        const transactionRequest = await axios.post(
          availableTrainings.url,
          null,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + polaruser.accessToken,
            },
          }
        );

        const transactionData = await transactionRequest.data;

        // LIST EXERCISES
        const activitiesRequest = await axios.get(
          transactionData["resource-uri"],
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + polaruser.accessToken,
            },
          }
        );
        const exerciseUrls = await activitiesRequest.data.exercises;

        // LOOP OVER EXERCISES
        await Promise.all(
          exerciseUrls &&
            exerciseUrls.map(async (url: any) => {
              const newExerciseRequest = await axios.get(url, {
                headers: {
                  Accept: "application/json",
                  Authorization: "Bearer " + polaruser.accessToken,
                },
              });

              const exerciseData = await newExerciseRequest.data;
              console.log(exerciseData);
              newTrainings.push(exerciseData);
            })
        );

        // COMMIT TRANSACTION
        const transactionCommitRequest = await axios.put(
          transactionData["resource-uri"],
          null,
          {
            headers: {
              Authorization: "Bearer " + polaruser.accessToken,
            },
          }
        );

        const transactionCommit = await transactionCommitRequest.data;
        console.log(transactionCommit);

        return newTrainings;
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("no new trainings");
      return [];
    }

    return [];
  }

  tranferPolarTrainingToCompletedTraining(polarTraining: any) {
    const completedTraining: CompletedTraining = new CompletedTraining();
    completedTraining.dateCompleted = polarTraining["start-time"];
    completedTraining.source = "POLAR";
    completedTraining.title = "POLAR " + polarTraining.sport;
    completedTraining.polarData = JSON.stringify(polarTraining);
    completedTraining.athlete = polarTraining.user;
    return completedTraining;
  }
}

export default new PolarController(
  new PolarUserDataService(PolarUserData),
  new PolarAuthorisationService(PolarAuthorisation),
  new UserService(User),
  new CompletedTrainingService(CompletedTraining)
);
