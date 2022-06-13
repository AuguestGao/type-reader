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
    const book = await Book.findById(req.params.id);

    if (!book) {
      throw new NotFoundError();
    }

    if (book.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    let body = book.body;

    if (book.status === BookStatus.Created) {
      body = [{ pageIndex: 0, pageContent: [] }];
    }

    res.status(200).send({
      meta: {
        bookId: book._id,
        title: book.title,
        author: book.author,
        totalPages: book.totalPages,
      },
      body: body,
    });
  }
);

export { router as seeOneBookRouter };
