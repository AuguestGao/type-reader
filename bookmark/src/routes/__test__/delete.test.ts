import mongoose from "mongoose";
import request from "supertest";

import { Bookmark } from "../../model/bookmark";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("deletes the right bookmark when all is well", async () => {
  const signInCookie = global.getSignInCookie();
  const bookId = new mongoose.Types.ObjectId();

  let bms = await Bookmark.find({});
  expect(bms.length).toEqual(0);

  await request(app)
    .post("/api/bookmark")
    .set("Cookie", signInCookie)
    .send({
      bookId: new mongoose.Types.ObjectId(),
    })
    .expect(201);

  await request(app)
    .post("/api/bookmark")
    .set("Cookie", signInCookie)
    .send({
      bookId,
    })
    .expect(201);

  await request(app)
    .delete("/api/bookmark")
    .set("Cookie", signInCookie)
    .send({
      bookId,
    })
    .expect(200);

  bms = await Bookmark.find({});
  expect(bms.length).toEqual(1);
});
