import express from "express";
import { getAllPlanets } from "./planets.controller.js";
const planetRouter = express.Router();

planetRouter.get("/", getAllPlanets);

export { planetRouter };
