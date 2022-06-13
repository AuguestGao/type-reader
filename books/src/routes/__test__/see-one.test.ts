import request from "supertest";

import { app } from "../../app";
import { Book } from "../../model/book";

it("returns the book when the request is all good", async () => {
  const signInCookie = global.getSignInCookie();

  await request(app).post("/api/books").set("Cookie", signInCookie).send({
    title: "1",
    body: "1",
    author: "1",
  });

  const res = await request(app)
    .post("/api/books")
    .set("Cookie", signInCookie)
    .send({
      title: "2",
      body: "2",
      author: "2",
    });

  const oneBookReq = await request(app)
    .get(`/api/books/${res.body.id}`)
    .set("Cookie", signInCookie)
    .send({})
    .expect(200);

  expect(oneBookReq.body!.meta.title).toBe("2");
});

it("gets the correct book for the user with the correct bookId", async () => {
  const signInCookie1 = global.getSignInCookie();

  const res1 = await request(app)
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

  const user1Req = await request(app)
    .get(`/api/books/${res1.body.id}`)
    .set("Cookie", signInCookie1)
    .send({})
    .expect(200);

  expect(user1Req.body!.meta.title).toEqual("1");
});

it("returns 401 if a user asks for another user's book", async () => {
  const signInCookie1 = global.getSignInCookie();

  const res1 = await request(app)
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

  await request(app)
    .get(`/api/books/${res1.body.id}`)
    .set("Cookie", signInCookie2)
    .send({})
    .expect(401);
});

it.todo("return 500 if a book has not been done parsing");
