import axios from "axios";
import launchesDatabase from "../models/launches.mongo.js";
import planetsMongo from "./planets.mongo.js";
// const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;
// const launch = {
//   flightNumber: 100,
//   mission: "Kepler Exploration X",
//   rocket: "Explorer IS1",
//   launchDate: new Date("December 27, 2030"),
//   target: "Kepler-442 b",
//   customers: ["ZTM", "NASA"],
//   upcoming: true,
//   success: true,
// };

// saveLaunch(launch);

async function populateLaunches() {
  const response = await axios.post(SPACE_X_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch Data");
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];

    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      customers: ["ZTM", "NASA"],
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);
    await saveLaunch(launch);
  }
}

const SPACE_X_URL = `https://api.spacexdata.com/v4/launches/query`;
async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data has already loaded");
  } else {
    await populateLaunches();
  }

  console.log("Downloading Data ...");
}

// launches.set(launch.flightNumber, launch);

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function existsLaunchId(launchId) {
  return await findLaunch({
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

async function getAllLaunches(skip, limit) {
  // return Array.from(launches.values());
  //excluding _id by setting its value to 0 also __v setting to 0
  // const paramsData=
  //here by default  mogodb does not sort our data
  //so we are sorting by flightNumber giving value 1 (for ascending order) ,
  //-1 fir descending order
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
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
  const planet = await planetsMongo.findOne({
    kepler_name: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

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

export {
  getAllLaunches,
  loadLaunchesData,
  scheduleFlightLaunch,
  existsLaunchId,
  AbortLaunchId,
};
