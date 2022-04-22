import request from "supertest";

import { app } from "../../app";

it("returns a 200 and null for currentUser if there is no jwt", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});

it("gets the currentUser's displayName if the user is logged in", async () => {
  const cookie = await global.getSignInCookie();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.displayName).toEqual("john");
});
