import request from "supertest";
import { app } from "../../app";

it("clears a cookie after it signs a user out", async () => {
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
});
