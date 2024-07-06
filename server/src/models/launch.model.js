import launchesDatabase from "../models/launches.mongo.js";
import planetsMongo from "./planets.mongo.js";
// const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

// launches.set(launch.flightNumber, launch);

async function existsLaunchId(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFlightNymber() {
  //-flightNumber sort in decending order
  //so here we get highest value
  const latest = await launchesDatabase.findOne().sort("-flightNumber");
  if (!latest) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latest.flightNumber;
}

async function getAllLaunches() {
  // return Array.from(launches.values());
  //excluding _id by setting its value to 0 also __v setting to 0
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planetsMongo.findOne({
    kepler_name: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

// function AddLaunch(launch) {
//   latestFightNumber++;
//   launches.set(
//     latestFightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customers: ["ZTM", "NASA"],
//       flightNumber: latestFightNumber,
//     })
//   );
// }

async function scheduleFlightLaunch(launch) {
  //always increase by 1 because by this function we got maximum,
  // then set the new value by +1
  const newFlightNumber = (await getLatestFlightNymber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function AbortLaunchId(launchId) {
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  console.log(aborted);

  return aborted.modifiedCount === 1;
}

export { getAllLaunches, scheduleFlightLaunch, existsLaunchId, AbortLaunchId };
