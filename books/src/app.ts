import express, { Request, Response } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";

import { errorHandler, NotFoundError, currentUser } from "@type-reader/common";

import { createBookRouter } from "./routes/create";
import { seeAllBooksRouter } from "./routes/see-all";
import { seeOneBookRouter } from "./routes/see-one";
import { deleteBookRouter } from "./routes/delete";
import { completeBookRouter } from "./routes/complete";

const app = express();

app.set("trust proxy", true);
app.use(json({ limit: "1mb" }));
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== "test",
    secure: false,
  })
);
app.use(currentUser);

app.use(createBookRouter);
app.use(seeOneBookRouter);
app.use(seeAllBooksRouter);
app.use(deleteBookRouter);
app.use(completeBookRouter);

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
