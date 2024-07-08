import mongoose from "mongoose";

const launchesMongo = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  target: {
    type: String,
  },
  customers: {
    type: [String],
    required: true,
  },
  upcoming: {
    type: String,
    required: true,
  },
  success: {
    type: String,
    required: true,
  },
});

//connects launchesschema  with "launches" collection
export default mongoose.model("Launch", launchesMongo);

// export { Launches };
