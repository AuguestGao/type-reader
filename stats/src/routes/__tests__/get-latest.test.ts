import request from "supertest";

import { Stats } from "../../model/stats";
import { app } from "../../app";

it("returns 400 if userId is missing", async () => {
  await request(app).get("/api/stats/latest").send({}).expect(401);
});

it("returns latest stats if everything is good", async () => {
  const { userId, cookie } = global.getSignIn();

  const stats = Stats.build({ userId });
  await stats.save();

  const req1 = await request(app)
    .get("/api/stats")
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(req1.body.totalReadInSec).toBe(0);

  const bookId = global.getBookId();

  const data1 = {
    bookId,
    correctEntry: 20,
    incorrectEntry: 5,
    fixedEntry: 10,
    readInSec: 60,
    pageHistory: global.getPageHistory(20, 5, 10),
    pageIndex: 10,
    cursorIndex: "0,30",
  };

  const data2 = {
    bookId,
    correctEntry: 50,
    incorrectEntry: 0,
    fixedEntry: 1,
    readInSec: 51,
    pageHistory: global.getPageHistory(50, 0, 1),
    pageIndex: 7,
    cursorIndex: "10,225",
  };

  await request(app)
    .patch("/api/stats")
    .set("Cookie", cookie)
    .send({ ...data1 })
    .expect(204);

  await request(app)
    .patch("/api/stats")
    .set("Cookie", cookie)
    .send({ ...data1 })
    .expect(204);

  await request(app)
    .patch("/api/stats")
    .set("Cookie", cookie)
    .send({ ...data2 })
    .expect(204);

  const req2 = await request(app)
    .get("/api/stats/latest")
    .set("Cookie", cookie);

  // console.log("res2.body =>", req2.body);
  expect(req2.body.totalEntry).toBe(50);
});

it("returns {} if no record in stats", async () => {
  const { userId, cookie } = global.getSignIn();

  const stats = Stats.build({ userId });
  await stats.save();

  const req1 = await request(app)
    .get("/api/stats")
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(req1.body.totalReadInSec).toBe(0);

  const res2 = await request(app)
    .get("/api/stats/latest")
    .set("Cookie", cookie)
    .expect(200);

  // console.log(res2.body);
  expect(res2.body).toEqual({});
});
