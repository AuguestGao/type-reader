import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";

import { errorHandler, NotFoundError } from "@type-reader/common";

import { newBookRouter } from "./routes/new";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // only send cookies via https
  })
);

app.use(newBookRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
