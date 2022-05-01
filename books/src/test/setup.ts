import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import { app } from "../app";

declare global {
  function getSignInCookie(): string[];
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "1234";

  mongo = new MongoMemoryServer();

  await mongo.start();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.getSignInCookie = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    displayName: "john",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJson = JSON.stringify(session);

  const base64 = Buffer.from(sessionJson).toString("base64");

  // console.log(base64);

  return [`session=${base64}`];
};
