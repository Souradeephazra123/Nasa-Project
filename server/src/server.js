import http from "http";

import dotenv from "dotenv";
dotenv.config();

import { mongoConnect } from "./services/mongo.js";
import { loadLaunchesData } from "./models/launch.model.js";

import { app } from "./app.js";

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadLaunchesData();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
startServer();
