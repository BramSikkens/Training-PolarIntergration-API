// import express from "express";
// import dotenv from "dotenv";
import { createConnection } from "typeorm";
import App from "./app";
import AthleteController from "./controllers/AthleteController";

(async () => {
  try {
    await createConnection();
  } catch (error) {
    console.log("Error while connecting to the database", error);
    return error;
  }
  const app = new App([AthleteController], 5000);
  app.listen();
})();
