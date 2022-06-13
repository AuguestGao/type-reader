import { Router, Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from "@type-reader/common";

import { BookCreatedPublisher } from "../events/publisher/book-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { Book } from "../model/book";

const router = Router();
const BOOK_LIMIT = 3;

router.post(
  "/api/books",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("body").notEmpty().withMessage("Body is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;

    const numberBooks = await Book.countDocuments({ userId });

    if (numberBooks >= BOOK_LIMIT) {
      throw new BadRequestError(
        "You have 3 books on hand, why not finishing some first?"
      );
    }

    const { title, body, author } = req.body;
    const book = Book.build({
      title,
      body,
      userId,
      author: author ? author : "Anonymous",
    });
    await book.save();

    new BookCreatedPublisher(natsWrapper.client).publish({
      userId: book.userId,
      bookId: book.id,
      body: book.body,
    });

    res.status(201).send({ id: book._id, message: "Book created." });
  }
);

export { router as createBookRouter };
