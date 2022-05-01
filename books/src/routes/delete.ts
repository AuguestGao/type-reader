import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@type-reader/common";

import { Book } from "../model/book";

const router = Router();

router.delete(
  "/api/books/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const book = await Book.findOneAndDelete({
      userId: req.currentUser!.id,
      _id: req.params.id,
    });

    res.status(200).send(book);
  }
);

export { router as deleteBookRouter };
