import request from "supertest";

import { Book } from "../../model/book";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("gets a 404 if a user deletes other user's book, i.e. not found", async () => {
  const signInCookie1 = global.getSignInCookie();

  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie1)
    .send({
      title: "1",
      body: "1",
      author: "1",
    })
    .expect(201);

  const signInCookie2 = global.getSignInCookie();
  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie2)
    .send({
      title: "2",
      body: "2",
      author: "2",
    })
    .expect(201);

  const res = await request(app)
    .get("/api/books")
    .set("Cookie", signInCookie2)
    .send({})
    .expect(200);

  const bookId = res.body[0].id;

  await request(app)
    .delete(`/api/books/${bookId}`)
    .set("Cookie", signInCookie1)
    .expect(404);
});

it("should have 1 less book in the library after deleting a book", async () => {
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

it("publishes book:deleted event", async () => {
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

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
