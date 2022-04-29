import request from "supertest";

import { app } from "../../app";

it("returns a 201 if everything goes well", async () => {
  const cookie = global.getSignInCookie();

  await request(app)
    .post("/api/books")
    .set("Cookie", cookie)
    .send({
      title: "Alice's Adventures in Wonderland",
      body: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?`,
      author: "Lewis Carroll",
    })
    .expect(201);
});

it.todo("returns a 400 when title or body id missing at creation");
