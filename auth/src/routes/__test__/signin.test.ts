import request from "supertest";
import { app } from "../../app";

it("returns a 400 with invalid email", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "john",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with no password", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "john",
      password: "",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "john",
      password: "p",
    })
    .expect(400);
});

it("returns a 400 with wrong password", async () => {
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

  await request(app)
    .post("/api/users/signin")
    .send({ email: "john@test.com", password: "passwords" })
    .expect(400);
});

it("returns a 400 with non-existing user", async () => {
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

  await request(app)
    .post("/api/users/signin")
    .send({ email: "alice@test.com", password: "123123" })
    .expect(400);
});

it("returns a 200 when everything goes right", async () => {
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

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "john@test.com", password: "password" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
