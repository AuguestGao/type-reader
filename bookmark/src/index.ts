import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { BookCreatedListener } from "./events/listeners/book-created-listener";
import { BookDeletedListener } from "./events/listeners/book-deleted-listener";
import { StatsUpdatedListener } from "./events/listeners/stats-updated-listener";

const start = async () => {
  console.log("starting up....");
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined.");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined.");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined.");
  }
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATs connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new BookCreatedListener(natsWrapper.client).listen();
    new BookDeletedListener(natsWrapper.client).listen();
    new StatsUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo DB.");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Bookmark is listensing at port 3000!");
  });
};

start();
