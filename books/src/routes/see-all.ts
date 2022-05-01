import { Router, Request, Response } from "express";
import { requireAuth } from "@type-reader/common";

import { Book } from "../model/book";

const router = Router();

router.get("/api/books", requireAuth, async (req: Request, res: Response) => {
  const books = await Book.find({ userId: req.currentUser!.id }).select([
    "title",
    "_id",
  ]);

  res.status(200).send(books);
});

export { router as seeAllBooksRouter };
