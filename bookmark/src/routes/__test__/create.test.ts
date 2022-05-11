import request from "supertest";

import { Bookmark } from "../../model/bookmark";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("has a route handler listening to '/api/bookmark' for post request", async () => {
  const res = await request(app).post("/api/bookmark").send({});

  expect(res.statusCode).not.toEqual(404);
});

it("returns 400 with an invalid bookId", async () => {
  await request(app)
    .post("/api/bookmark")
    .set("Cookie", global.getSignInCookie())
    .send({
      bookId: "123123213",
    })
    .expect(400);

  await request(app)
    .post("/api/bookmark")
    .set("Cookie", global.getSignInCookie())
    .send({})
    .expect(400);
});

it("creates a new bookmark when all is well", async () => {
  let bms = await Bookmark.find({});
  expect(bms.length).toEqual(0);

  await request(app)
    .post("/api/bookmark")
    .set("Cookie", global.getSignInCookie())
    .send({
      bookId: new mongoose.Types.ObjectId(),
    })
    .expect(201);

  bms = await Bookmark.find({});
  expect(bms.length).toEqual(1);
});
