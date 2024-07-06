import express from "express";
import cors from "cors";
import { planetRouter } from "./routes/planets/planets.router.js";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import { launchesRouter } from "./routes/launches/launches.router.js";

const app = express();

// Create __dirname equivalent
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const __dirname = path.resolve();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://ayatrio-admin.s3-website.ap-south-1.amazonaws.com",
      "https://main.d2e7lk624os6uh.amplifyapp.com",
    ],
    methods: "GET,POST,PUT,DELETE",
    //   credentials: true,
  })
);


//logging with morgan , logging all details
app.use(morgan("combined"));

//converting into json
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/planets", planetRouter);
app.use("/launches", launchesRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

export { app };
