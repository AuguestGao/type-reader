import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI muse be defined.");
  }

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY muse be defined.");
  }

  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo DB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Auth is listening on PORT 3000!");
  });
};

start();
