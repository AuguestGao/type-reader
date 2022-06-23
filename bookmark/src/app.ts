import express, { Request, Response } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";

import { errorHandler, NotFoundError, currentUser } from "@type-reader/common";

import { getBookmarkRouter } from "./routes/get";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(getBookmarkRouter);

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
