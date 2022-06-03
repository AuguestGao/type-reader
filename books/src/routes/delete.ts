import { Router, Request, Response } from "express";
import { NotFoundError, requireAuth } from "@type-reader/common";

import { Book } from "../model/book";
import { natsWrapper } from "../nats-wrapper";
import { BookDeletedPublisher } from "../events/publisher/book-deleted-publisher";

const router = Router();

router.delete(
  "/api/books/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      userId: req.currentUser!.id,
    });

    if (!book) {
      throw new NotFoundError();
    }

    new BookDeletedPublisher(natsWrapper.client).publish({
      bookId: book._id,
      userId: book.userId,
    });
    res.status(204).send();
  }
);

export { router as deleteBookRouter };
