import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@type-reader/common";

import { BookCreatedPublisher } from "../events/publisher/book-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { Book } from "../model/book";

const router = Router();

router.post(
  "/api/books",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("body").notEmpty().withMessage("Body is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, body, author } = req.body;
    const book = Book.build({
      title,
      body,
      userId: req.currentUser!.id,
      author: author ? author : "Anonymous",
    });
    await book.save();

    new BookCreatedPublisher(natsWrapper.client).publish({
      bookId: book.id,
      userId: book.userId,
    });

    res.status(201).send({ id: book._id, message: "Book created." });
  }
);

export { router as createBookRouter };
