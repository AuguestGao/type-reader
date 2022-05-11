import express, { Request, Response } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";

import { errorHandler, NotFoundError, currentUser } from "@type-reader/common";

import { createBookmarkRouter } from "./routes/create";
import { getBookmarkRouter } from "./routes/get";
import { deleteBookmarkRouter } from "./routes/delete";
import { updateBookmarkRouter } from "./routes/update";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // only send cookies via https
  })
);
app.use(currentUser); //inject currentUser in req.currentUser

app.use(createBookmarkRouter);
app.use(getBookmarkRouter);
app.use(deleteBookmarkRouter);
app.use(updateBookmarkRouter);

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
