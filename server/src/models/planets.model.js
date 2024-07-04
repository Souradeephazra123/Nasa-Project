import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
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

fs.createReadStream(path.join(__dirname,'data','kepler_data.csv'))
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => {
    if (isHavitable(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    // console.log(
    //   habitablePlanets.map((planet) => {
    //     return planet["kepler_name"];
    //   })
    // );
    // console.log(`${habitablePlanets.length} havitable planets found`);
    console.log("done");
  });

export { habitablePlanets as planets };
