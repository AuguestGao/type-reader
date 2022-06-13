import { Router, Request, Response } from "express";
import {
  NotFoundError,
  requireAuth,
  BookStatus,
  NotAuthorizedError,
} from "@type-reader/common";
import { Book } from "../model/book";

const router = Router();

router.patch(
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

    book.set({
      status: BookStatus.Completed,
    });

    await book.save();

    res.status(204).send();
  }
);

export { router as completeBookRouter };
