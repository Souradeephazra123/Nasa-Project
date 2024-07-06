import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import planets from "../models/planets.mongo.js";
import { fileURLToPath } from "url";

// Create __dirname equivalent
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const __dirname = path.resolve();

// console.log(__dirname);

// Now you can use __dirname to construct paths
const filePath = path.join(__dirname, "../../data/kepler_data.csv");

const habitablePlanets = [];
function isHavitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

fs.createReadStream(path.join(__dirname, "data", "kepler_data.csv"))
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", async (data) => {
    if (isHavitable(data)) {
      // habitablePlanets.push(data);
      //insert + update =upsert
      await savePlanets(data);
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", async () => {
    const countOfPlanets = (await getAllPlanets()).length;

    // console.log(
    //   habitablePlanets.map((planet) => {
    //     return planet["kepler_name"];
    //   })
    // );
    // console.log(`${countOfPlanets} havitable planets found`);
    console.log("done");
  });

async function getAllPlanets() {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function savePlanets(planet) {
  try {
    await planets.updateOne(
      {
        kepler_name: planet.kepler_name,
      },
      {
        kepler_name: planet.kepler_name,
      },
      { upsert: true }
    );
  } catch (error) {
    console.error(`Can't save a planet ${error}`);
  }
}

export { habitablePlanets as planets, getAllPlanets };
