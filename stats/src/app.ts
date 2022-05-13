import express, { Request, Response } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";

import { errorHandler, NotFoundError, currentUser } from "@type-reader/common";
import { getLatestStatsRouter } from "./routes/get-latest";
import { createStatsRouter } from "./routes/create";

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
app.use(getLatestStatsRouter);
app.use(createStatsRouter);

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
