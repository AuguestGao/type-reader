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

  // console.log(res1.get("Set-Cookie"));

  await request(app).post("/api/users/signout").expect(204);

  // console.log(res2.get("Set-Cookie"));
});
