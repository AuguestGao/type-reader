import request from "supertest";

import { Bookmark } from "../../model/bookmark";
import { app } from "../../app";

it("returns 401 when an existing bookmark does not belong to the user", async () => {
  const book1 = global.getBookId();
  const book2 = global.getBookId();
  const user1 = global.getSignIn();
  const user2 = global.getSignIn();

  const bk1 = Bookmark.build({ userId: user1.userId, bookId: book1 });
  await bk1.save();
  const bk2 = Bookmark.build({ userId: user2.userId, bookId: book2 });
  await bk2.save();

  await request(app)
    .get(`/api/bookmark/${book2}`)
    .set("Cookie", user1.cookie)
    .send()
    .expect(401);
});

it("returns 400 with an invalid bookId", async () => {
  const book1 = global.getBookId();
  const user1 = global.getSignIn();

  const bk1 = Bookmark.build({ userId: user1.userId, bookId: book1 });
  await bk1.save();

  // id is not legit
  await request(app)
    .get("/api/bookmark/911")
    .set("Cookie", user1.cookie)
    .send()
    .expect(404);

  // id is legit but not exist
  await request(app)
    .get(`/api/bookmark/${global.getBookId()}`)
    .set("Cookie", user1.cookie)
    .send()
    .expect(404);
});

it("returns 200 when all is good", async () => {
  const book1 = global.getBookId();
  const book2 = global.getBookId();
  const user1 = global.getSignIn();
  const user2 = global.getSignIn();

  const bk1 = Bookmark.build({ userId: user1.userId, bookId: book1 });
  await bk1.save();
  const bk2 = Bookmark.build({ userId: user2.userId, bookId: book2 });
  await bk2.save();

  const req1 = await request(app)
    .get(`/api/bookmark/${book1}`)
    .set("Cookie", user1.cookie)
    .send()
    .expect(200);

  expect(req1.body.totalSecOnBook).toBe(0);

  const req2 = await request(app)
    .get(`/api/bookmark/${book2}`)
    .set("Cookie", user2.cookie)
    .send()
    .expect(200);

  expect(req2.body.pageIndex).toBe(0);
});
