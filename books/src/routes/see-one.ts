import { Router, Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@type-reader/common";

import { Book } from "../model/book";

const router = Router();

router.get(
  "/api/books/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
      throw new NotFoundError();
    }

    if (book.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(book);
  }
);

export { router as seeOneBookRouter };
