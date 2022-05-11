import mongoose from "mongoose";
import request from "supertest";
import { Bookmark } from "../../model/bookmark";

import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("updates a bookmark when all is well", async () => {
  const signinCookie = global.getSignInCookie();
  const bookId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/bookmark")
    .set("Cookie", signinCookie)
    .send({
      bookId,
    })
    .expect(201);

  await request(app)
    .patch("/api/bookmark")
    .set("Cookie", signinCookie)
    .send({
      bookId,
      prevText: "first bookmark update",
      pageIndex: 1,
      readTime: 10,
    })
    .expect(200);

  const res1 = await request(app)
    .get("/api/bookmark")
    .set("Cookie", signinCookie)
    .send({
      bookId,
    })
    .expect(200);

  //console.log(res1.body)

  await request(app)
    .patch("/api/bookmark")
    .set("Cookie", signinCookie)
    .send({
      bookId,
      prevText: "second bookmark update",
      pageIndex: 5,
      readTime: 102,
    })
    .expect(200);

  const res2 = await request(app)
    .get("/api/bookmark")
    .set("Cookie", signinCookie)
    .send({
      bookId,
    })
    .expect(200);

  expect(res2.body.totalReadTime).toBe(112);
});
