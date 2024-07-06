import mongoose from "mongoose";

const planetsMongo = new mongoose.Schema({
  kepler_name: {
    type: String,
    required: true,
  },
});


export default mongoose.model('Planet',planetsMongo);