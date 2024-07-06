import mongoose from "mongoose";

const MONGO_URI = `mongodb+srv://bubun:bubun@cluster0.isvfuvh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URI);
}

export { mongoConnect };
