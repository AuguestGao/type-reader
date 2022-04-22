import request from "supertest";

import { app } from "../../app";

it("retruns 400 if there is no email in the cookie", async () => {
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

  await request(app).post("/api/users/resetpassword").send({}).expect(400);
});

it("returns a 400 with an invalid answer", async () => {
  const cookie = await global.getForgotPasswordCookie();

  await request(app)
    .post("/api/users/resetpassword")
    .set("Cookie", cookie)
    .send({
      answer: "answersss",
      password: "123123",
      confirmPassword: "123123",
    })
    .expect(400);
});

it("returns a 400 when two passwords unmatching", async () => {
  const cookie = await global.getForgotPasswordCookie();

  await request(app)
    .post("/api/users/resetpassword")
    .set("Cookie", cookie)
    .send({
      answer: "answer",
      password: "123123",
      confirmPassword: "asdasd",
    })
    .expect(400);
});

it("gets a 200 when everything goes well", async () => {
  const cookie = await global.getForgotPasswordCookie();

  await request(app)
    .post("/api/users/resetpassword")
    .set("Cookie", cookie)
    .send({
      answer: "answer",
      password: "123123",
      confirmPassword: "123123",
    })
    .expect(200);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "john@test.com",
      password: "123123",
    })
    .expect(200);
});
