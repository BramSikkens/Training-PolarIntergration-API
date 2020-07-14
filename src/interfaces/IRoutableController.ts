import express from "express";

export default interface IRoutableController {
  path: string;
  router: express.Router;
  initializeRoutes(): void;
}
