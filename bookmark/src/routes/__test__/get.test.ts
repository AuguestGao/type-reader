import request from "supertest";

import { Bookmark } from "../../model/bookmark";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

// it("returns 400 with an invalid bookId", async () => {
//   await request(app)
//     .post("/api/bookmark")
//     .set("Cookie", global.getSignInCookie())
//     .send({
//       bookId: "123123213",
//     })
//     .expect(400);

//   await request(app)
//     .post("/api/bookmark")
//     .set("Cookie", global.getSignInCookie())
//     .send({})
//     .expect(400);
// });

it("gets the right bookmark when all is well", async () => {
  const signInCookie1 = global.getSignInCookie();
  const bookId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/bookmark")
    .set("Cookie", signInCookie1)
    .send({
      bookId: new mongoose.Types.ObjectId(),
    })
    .expect(201);

  await request(app)
    .post("/api/bookmark")
    .set("Cookie", signInCookie1)
    .send({
      bookId: bookId,
    })
    .expect(201);

  const res1 = await request(app)
    .get("/api/bookmark")
    .set("Cookie", signInCookie1)
    .send({ bookId: bookId })
    .expect(200);

  expect(res1.body.bookId).toEqual(bookId.toString("hex"));
});
