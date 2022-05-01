import request from "supertest";

import { Book } from "../../model/book";
import { app } from "../../app";

it("returns the book when the request is all good", async () => {
  const signInCookie = global.getSignInCookie();

  await request(app).post("/api/books").set("Cookie", signInCookie).send({
    title: "1",
    body: "1",
    author: "1",
  });

  await request(app).post("/api/books").set("Cookie", signInCookie).send({
    title: "2",
    body: "2",
    author: "2",
  });

  const allBooksReq = await request(app)
    .get("/api/books")
    .set("Cookie", signInCookie)
    .send({})
    .expect(200);

  const bookId = allBooksReq.body[1].id;

  const oneBookReq = await request(app)
    .get(`/api/books/${bookId}`)
    .set("Cookie", signInCookie)
    .send({})
    .expect(200);

  expect(oneBookReq.body!.title).toEqual("2");
});

it("only returns user's own book with correct book id", async () => {
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

  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie1)
    .send({
      title: "2",
      body: "2",
      author: "2",
    })
    .expect(201);

  const signInCookie2 = global.getSignInCookie();

  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie2)
    .send({
      title: "3",
      body: "3",
      author: "3",
    })
    .expect(201);

  const allBooksReq = await request(app)
    .get("/api/books")
    .set("Cookie", signInCookie2)
    .send({})
    .expect(200);

  const bookId = allBooksReq.body[0].id;

  const oneBookReq = await request(app)
    .get(`/api/books/${bookId}`)
    .set("Cookie", signInCookie2)
    .send({})
    .expect(200);

  expect(oneBookReq.body!.title).toEqual("3");
});

it("returns 401 if a user asks for another user's book", async () => {
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

  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie1)
    .send({
      title: "2",
      body: "2",
      author: "2",
    })
    .expect(201);

  const signInCookie2 = global.getSignInCookie();

  await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie2)
    .send({
      title: "3",
      body: "3",
      author: "3",
    })
    .expect(201);

  const allBooksReq = await request(app)
    .get("/api/books")
    .set("Cookie", signInCookie2)
    .send({})
    .expect(200);

  const bookId = allBooksReq.body[0].id;

  const oneBookReq = await request(app)
    .get(`/api/books/${bookId}`)
    .set("Cookie", signInCookie1)
    .send({})
    .expect(401);
});
