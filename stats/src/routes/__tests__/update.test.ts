import request from "supertest";

import { app } from "../../app";
import { Record } from "../../model/record";
import { Stats } from "../../model/stats";

it("has a route handler listening to '/api/stats' for patch request", async () => {
  const res = await request(app).patch("/api/stats").send({});

  expect(res.statusCode).not.toEqual(404);
});

it("returns 400 if any field is missing", async () => {
  const { userId, cookie } = global.getSignIn();

  const stats = Stats.build({ userId });
  await stats.save();

  await request(app)
    .patch("/api/stats")
    .set("Cookie", cookie)
    .send({})
    .expect(400);
});

it("updates stats right when everything goes well", async () => {
  const { userId, cookie } = global.getSignIn();

  const stats = Stats.build({ userId });
  await stats.save();

  await Stats.findOne({ userId });

  const bookId = global.getBookId();
  const data = {
    bookId,
    correctEntry: 20,
    incorrectEntry: 5,
    fixedEntry: 10,
    readInSec: 60,
    pageIndex: 10,
    cursorIndex: 50,
  };

  await request(app)
    .patch("/api/stats")
    .set("Cookie", cookie)
    .send({ ...data, pageHistory: global.getPageHistory(1, 2, 3) })
    .expect(204);

  await request(app)
    .patch("/api/stats")
    .set("Cookie", cookie)
    .send({ ...data, pageHistory: global.getPageHistory(2, 4, 6) })
    .expect(204);

  await request(app)
    .patch("/api/stats")
    .set("Cookie", cookie)
    .send({ ...data, pageHistory: global.getPageHistory(1, 4, 8) })
    .expect(204);
});
