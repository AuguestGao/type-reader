import request from "supertest";

import { app } from "../../app";

it("returns a 400 with invalid email", async () => {
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

  // not an Email
  await request(app)
    .post("/api/users/forgotpassword")
    .send({
      email: "john",
    })
    .expect(400);

  // non-existing email
  const response = await request(app)
    .post("/api/users/forgotpassword")
    .send({
      email: "alice@test.com",
    })
    .expect(400);

  expect(response.body.errors[0].message).toEqual("No such an Email");
});

it("returns a 200 with an valid email", async () => {
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
    .post("/api/users/forgotpassword")
    .send({
      email: "john@test.com",
    })
    .expect(200);

  expect(response.body.question).toEqual("question");

  expect(response.get("Set-Cookie")).toBeDefined();
});
