import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../app";

declare global {
  function getSignInCookie(): Promise<string[]>;
  function getForgotPasswordCookie(): Promise<string[]>;
}

jest.mock("../nats-wrapper.ts");

let mongo: any;

beforeAll(async () => {
  jest.setTimeout(30000);

  process.env.JWT_KEY = "1234";
  // use in-mem mongo db and connect mongose with it
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  // clear mock implementations
  jest.clearAllMocks();

  // reset entire db before each test
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

// for test env only
global.getSignInCookie = async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      displayName: "john",
      email: "john@test.com",
      password: "password",
      confirmPassword: "password",
      question: "question",
      answer: "answer",
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};

global.getForgotPasswordCookie = async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      displayName: "john",
      email: "john@test.com",
      password: "password",
      confirmPassword: "password",
      question: "question",
      answer: "answer",
    })
    .expect(201);

  await request(app).post("/api/users/signout").expect(204);

  const response = await request(app)
    .post("/api/users/forgotpassword")
    .send({ email: "john@test.com" })
    .expect(200);

  const emailCookie = response.get("Set-Cookie");

  return emailCookie;
};
