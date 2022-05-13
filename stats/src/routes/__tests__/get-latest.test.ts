import request from "supertest";

import { Stats } from "../../model/stats";
import { app } from "../../app";

it.todo("get the latest stat");

// it("returns the book when the request is all good", async () => {
//   const signInCookie = global.getSignInCookie();

//   await request(app).post("/api/books").set("Cookie", signInCookie).send({
//     title: "1",
//     body: "1",
//     author: "1",
//   });

//   await request(app).post("/api/books").set("Cookie", signInCookie).send({
//     title: "2",
//     body: "2",
//     author: "2",
//   });

//   const allBooksReq = await request(app)
//     .get("/api/books")
//     .set("Cookie", signInCookie)
//     .send({})
//     .expect(200);

//   const bookId = allBooksReq.body[1].id;

//   const oneBookReq = await request(app)
//     .get(`/api/books/${bookId}`)
//     .set("Cookie", signInCookie)
//     .send({})
//     .expect(200);

//   expect(oneBookReq.body!.title).toEqual("2");
// });
