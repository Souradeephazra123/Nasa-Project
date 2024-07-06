import http from "http";
import { mongoConnect } from "./services/mongo.js";

import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
startServer();
