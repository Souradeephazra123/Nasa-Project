import {
  getAllLaunches,
  AddLaunch,
  existsLaunchId,
  AbortLaunchId,
} from "../../models/launch.model.js";

function httpGetAllLaunches(req, res) {
  //.values gives iterable values in the map, now have to array them
  //so creating an array by Array.from   from lasunches,value()
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;
  //validaton of input body

  if (!launch.mission) {
    return res.status(400).json({
      Error: "Missing mission property",
    });
  }
  if (!launch.rocket) {
    return res.status(400).json({
      Error: "Missing rocket property",
    });
  }
  if (!launch.launchDate) {
    return res.status(400).json({
      Error: "Missing launchDate property",
    });
  }
  if (!launch.target) {
    return res.status(400).json({
      Error: "Missing target property",
    });
  }

  // if (
  //   !launch.mission ||
  //   !launch.rocket ||
  //   !launch.launchDate ||
  //   !launch.destination
  // ) {
  //   return res.status(400).json({
  //     Error: "Missing required launch property",
  //   });
  // }

  //converting date string to date objetc
  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      Error: "Invalid launch date",
    });
  }

  AddLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  //remember to convert this into id because it comes string as default type
  const launchId = Number(req.params.id);
  //if launchid doesnot exist

  if (!existsLaunchId(launchId)) {
    return res.status(404).json({
      Error: "Launch not found",
    });
  }

  //if launch id found
  const aborted = AbortLaunchId(launchId);
  return res.status(200).json(aborted);
}

export { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
