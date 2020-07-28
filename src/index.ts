// import express from "express";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import App from "./app";
import AthleteController from "./controllers/AthleteController";
import UserController from "./controllers/UserController";
import TrainerController from "./controllers/TrainerController";
import TeamController from "./controllers/TeamController";
import EventController from "./controllers/EventController";
import DailyMetricController from "./controllers/DailyMetricController";
import TrainingZoneController from "./controllers/TrainingZoneController";

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
      AthleteController,
      UserController,
      TrainerController,
      TeamController,
      EventController,
      DailyMetricController,
      TrainingZoneController,
    ],
    // tslint:disable-next-line: radix
    parseInt(process.env.PORT)
  );
  app.listen();
})();
