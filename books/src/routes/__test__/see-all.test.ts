import request from "supertest";

import { Book } from "../../model/book";
import { app } from "../../app";

it("returns 200 when everything is well", async () => {
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

  const res = await request(app)
    .get("/api/books")
    .set("Cookie", signInCookie)
    .send({})
    .expect(200);

  expect(res.body[0].title).toEqual("1");
});

it("only returns user's own books", async () => {
  let books = await Book.find({});
  expect(books.length).toEqual(0);

  const signInCookie1 = global.getSignInCookie();

  // user 1 adds the first book
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

  // user 2 adds the second book
  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie2)
    .send({
      title: "2",
      body: "2",
      author: "2",
    })
    .expect(201);

  // user 1 adds the third book
  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie1)
    .send({
      title: "3",
      body: "3",
      author: "3",
    })
    .expect(201);

  books = await Book.find({});

  expect(books.length).toEqual(3);

  const res = await request(app)
    .get("/api/books")
    .set("Cookie", signInCookie1)
    .send({})
    .expect(200);

  // user 1 should see 2 books
  expect(res.body.length).toEqual(2);
});
