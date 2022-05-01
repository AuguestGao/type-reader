import request from "supertest";

import { Book } from "../../model/book";
import { app } from "../../app";

it("should have 1 less book in the library after deleting a book", async () => {
  // jest.setTimeout(10000);

  const signInCookie = global.getSignInCookie();

  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie)
    .send({
      title: "1",
      body: "1",
      author: "1",
    })
    .expect(201);

  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie)
    .send({
      title: "2",
      body: "2",
      author: "2",
    })
    .expect(201);

  const res1 = await request(app)
    .get("/api/books")
    .set("Cookie", signInCookie)
    .send({})
    .expect(200);

  expect(res1.body.length).toBe(2);

  const bookId = res1.body[0].id;

  await request(app)
    .delete(`/api/books/${bookId}`)
    .set("Cookie", signInCookie)
    .expect(200);

  const res = await request(app)
    .get("/api/books")
    .set("Cookie", signInCookie)
    .send({})
    .expect(200);

  expect(res.body.length).toBe(1);
});
