import { launchesRouter } from "./launches/launches.router.js";
import { planetRouter } from "./planets/planets.router.js";
import express from "express";

const api = express.Router();

api.use("/planets", planetRouter);
api.use("/launches", launchesRouter);

export { api };
