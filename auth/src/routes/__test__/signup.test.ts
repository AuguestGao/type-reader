import request from "supertest";
import { app } from "../../app";

it("returns a 400 with invalid display name", async () => {
  // no displayName
  await request(app)
    .post("/api/users/signup")
    .send({
      displayName: "",
      email: "john@test.com",
      password: "password",
      confirmPassword: "password",
      question: "question",
      answer: "answer",
    })
    .expect(400);

  // empty displayname after trimming
  await request(app)
    .post("/api/users/signup")
    .send({
      displayName: "   ",
      email: "john@test.com",
      password: "password",
      confirmPassword: "password",
      question: "question",
      answer: "answer",
    })
    .expect(400);
});

it("returns a 400 with invalid email", async () => {
  // invalid email
  await request(app)
    .post("/api/users/signup")
    .send({
      displayName: "1",
      email: "john@test",
      password: "password",
      confirmPassword: "password",
      question: "question",
      answer: "answer",
    })
    .expect(400);
});

it("returns a 400 with password length < 6 chars", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      displayName: "john",
      email: "john@test.com",
      password: "passw",
      confirmPassword: "passw",
      question: "question",
      answer: "answer",
    })
    .expect(400);
});

it("returns a 400 with unmatching password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      displayName: "john",
      email: "john@test.com",
      password: "password",
      confirmPassword: "pa",
      question: "question",
      answer: "answer",
    })
    .expect(400);
});

it("returns a 400 with invalid question", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      displayName: "1",
      email: "john@test.com",
      password: "password",
      confirmPassword: "password",
      question: "qu",
      answer: "answer",
    })
    .expect(400);
});

it("returns a 400 with invalid answer", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      displayName: "john",
      email: "john@test.com",
      password: "password",
      confirmPassword: "password",
      question: "question",
      answer: "an",
    })
    .expect(400);
});

it("disallows duplicated email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      displayName: "john1",
      email: "john@test.com",
      password: "password",
      confirmPassword: "password",
      question: "question",
      answer: "answer",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      displayName: "john2",
      email: "john@test.com",
      password: "password",
      confirmPassword: "password",
      question: "question",
      answer: "answer",
    })
    .expect(400);
});

it("returns a cookie", async () => {
  const response = await request(app).post("/api/users/signup").send({
    displayName: "john1",
    email: "john@test.com",
    password: "password",
    confirmPassword: "password",
    question: "question",
    answer: "answer",
  });

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("returns a 201 on a successful sign up", async () => {
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

  expect(response.get("Set-Cookie")).toBeDefined();
});
