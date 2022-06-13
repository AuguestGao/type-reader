import request from "supertest";

import { Stats } from "../../model/stats";
import { app } from "../../app";

it("returns 400 if userId is missing", async () => {
  await request(app).get("/api/stats").send({}).expect(401);
});

it("returns userStats if everything is good", async () => {
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
  const data = {
    bookId,
    correctEntry: 20,
    incorrectEntry: 5,
    fixedEntry: 10,
    readInSec: 60,
    pageHistory: global.getPageHistory(20, 5, 10),
    pageIndex: 10,
    cursorIndex: "0,200",
  };

  await request(app)
    .patch("/api/stats")
    .set("Cookie", cookie)
    .send({ ...data })
    .expect(204);

  await request(app)
    .patch("/api/stats")
    .set("Cookie", cookie)
    .send({ ...data })
    .expect(204);

  await request(app)
    .patch("/api/stats")
    .set("Cookie", cookie)
    .send({ ...data })
    .expect(204);

  const req2 = await request(app).get("/api/stats").set("Cookie", cookie);
  // console.log(req2.body);
  expect(req2.body.totalEntry).toBe(105);
  expect(req2.body.totalReadInSec).toBe(180);
});
