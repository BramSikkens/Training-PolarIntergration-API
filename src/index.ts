// import express from "express";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import App from "./app";
import AthleteController from "./controllers/AthleteController";
import CompletedTrainingController from "./controllers/CompletedTrainingController";
import DailyMetricController from "./controllers/DailyMetricController";
import EventController from "./controllers/EventController";
import MacroCycleController from "./controllers/MacroCycleController";
import MesoCycleController from "./controllers/MesoCycleController";
import MicroCycleController from "./controllers/MicroCycleController";
import PlannedTrainingController from "./controllers/PlannedTrainingController";
import TeamController from "./controllers/TeamController";
import TrainerController from "./controllers/TrainerController";
import TrainingZoneController from "./controllers/TrainingZoneController";
import UserController from "./controllers/UserController";
import TrainingTemplateController from "./controllers/TrainingTemplateController";
import PolarController from "./controllers/PolarController";

(async () => {
  const env = dotenv.config();
  try {
    await createConnection();
  } catch (error) {
    console.log("Error while connecting to the database", error);
    return error;
  }
  const app = new App(
    [
      TrainerController,
      AthleteController,
      UserController,
      TeamController,
      EventController,
      DailyMetricController,
      TrainingZoneController,
      PlannedTrainingController,
      CompletedTrainingController,
      MacroCycleController,
      MesoCycleController,
      MicroCycleController,
      TrainingTemplateController,
      PolarController,
    ],
    // tslint:disable-next-line: radix
    parseInt(process.env.PORT)
  );
  app.listen();
})();
