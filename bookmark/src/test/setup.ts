import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import { app } from "../app";

declare global {
  function getSignIn(): {
    userId: string;
    cookie: string[];
  };
  function getBookId(): string;
}

jest.mock("../nats-wrapper.ts");

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "1234";

  mongo = new MongoMemoryServer();

  await mongo.start();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.getSignIn = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    displayName: "john",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJson = JSON.stringify(session);

  const base64 = Buffer.from(sessionJson).toString("base64");

  // console.log(base64);

  return { userId: payload.id, cookie: [`session=${base64}`] };
};

global.getBookId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};
