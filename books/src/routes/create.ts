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
    body("title").not().isEmpty().withMessage("Title is required"),
    body("body").not().isEmpty().withMessage("Body is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, body, author } = req.body;
    const book = Book.build({
      title,
      body,
      userId: req.currentUser!.id,
      author: author ? author : "Unknown",
    });
    await book.save();

    new BookCreatedPublisher(natsWrapper.client).publish({
      bookId: book.id,
      userId: book.userId,
    });

    res.status(201).send({ id: book._id });
  }
);

export { router as createBookRouter };
