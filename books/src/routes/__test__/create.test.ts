import request from "supertest";

import { Book } from "../../model/book";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to '/api/books' for post request", async () => {
  const res = await request(app).post("/api/books").send({});

  expect(res.statusCode).not.toEqual(404);
});

it("returns 400 if title or body is missing", async () => {
  // missing title
  await request(app)
    .post("/api/books")
    .set("Cookie", global.getSignInCookie())
    .send({
      body: "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?",
      author: "Lewis Carroll",
    })
    .expect(400);

  // missing body
  await request(app)
    .post("/api/books")
    .set("Cookie", global.getSignInCookie())
    .send({
      title: "Alice's Adventures in Wonderland",
      author: "Lewis Carroll",
    })
    .expect(400);
});

it("returns a 201 if everything goes well", async () => {
  let books = await Book.find({});
  expect(books.length).toEqual(0);

  await request(app)
    .post("/api/books")
    .set("Cookie", global.getSignInCookie())
    .send({
      title: "Alice's Adventures in Wonderland",
      body: "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?",
      author: "Lewis Carroll",
    })
    .expect(201);

  books = await Book.find({});
  expect(books.length).toEqual(1);
});

it("fills author with 'unknown' if it's missing", async () => {
  await request(app)
    .post("/api/books")
    .set("Cookie", global.getSignInCookie())
    .send({
      title: "Alice's Adventures in Wonderland",
      body: "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?",
      author: "",
    })
    .expect(201);

  const books = await Book.find({});
  expect(books[0].author).toBe("Anonymous");
});

it("publishes a BookCreated event", async () => {
  await request(app)
    .post("/api/books")
    .set("Cookie", global.getSignInCookie())
    .send({
      title: "Alice's Adventures in Wonderland",
      body: "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?",
      author: "Lewis Carroll",
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("only allow 3 books for a user", async () => {
  const signInCookie = global.getSignInCookie();

  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie)
    .send({
      title: "1",
      body: "1",
    })
    .expect(201);

  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie)
    .send({
      title: "2",
      body: "2",
    })
    .expect(201);

  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie)
    .send({
      title: "3",
      body: "3",
    })
    .expect(201);

  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie)
    .send({
      title: "4",
      body: "4",
    })
    .expect(400);
});
