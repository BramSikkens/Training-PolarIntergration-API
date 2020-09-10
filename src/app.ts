import bodyparser from "body-parser";
import express from "express";
import IRoutableController from "./interfaces/IRoutableController";
import cors from "cors";
import passport from "./services/PassportLocalStrategyService";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: IRoutableController[], port: number) {
    this.app = express();

    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(bodyparser.urlencoded({ extended: true }));
    this.app.use(bodyparser.json());
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private initializeControllers(controllers: IRoutableController[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
