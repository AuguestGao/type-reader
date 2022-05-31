import { Router, Request, Response } from "express";
import { NotFoundError, requireAuth, BookStatus } from "@type-reader/common";
import { Book } from "../model/book";

const router = Router();

router.patch(
  "/api/books/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.currentUser!.id,
      },
      {
        status: BookStatus.Completed,
      }
    );

    if (!book) {
      throw new NotFoundError();
    }

    res.status(200).send({ id: book._id, message: "Book completed." });
  }
);

export { router as completeBookRouter };
