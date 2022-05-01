import express, { Request, Response } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";

import { errorHandler, NotFoundError, currentUser } from "@type-reader/common";

import { createBookRouter } from "./routes/create";
import { seeAllBooksRouter } from "./routes/see-all";
import { seeOneBookRouter } from "./routes/see-one";
import { deleteBookRouter } from "./routes/delete";

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

app.use(createBookRouter);
app.use(seeOneBookRouter);
app.use(seeAllBooksRouter);
app.use(deleteBookRouter);

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
