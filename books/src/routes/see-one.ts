import { Router, Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  InternalError,
  BookStatus,
} from "@type-reader/common";

import { Book } from "../model/book";

const router = Router();

router.get(
  "/api/books/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const book = await Book.findById(req.params.id).select([
      "title",
      "author",
      "totalPages",
      "body",
      "createdAt",
      "updatedAt",
      "status",
    ]);

    if (!book) {
      throw new NotFoundError();
    }

    if (book.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (book.status === BookStatus.Created) {
      throw new InternalError("Book is under paging process.");
    }

    res.status(200).send(book);
  }
);

export { router as seeOneBookRouter };
