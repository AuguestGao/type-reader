import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@type-reader/common";

import { natsWrapper } from "../nats-wrapper";
import { Bookmark } from "../model/bookmark";

const router = Router();

router.post(
  "/api/bookmark",
  requireAuth,
  [
    body("bookId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Invalid bookId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { bookId } = req.body;

    const bookmark = Bookmark.build({
      bookId,
      userId: req.currentUser!.id,
    });
    await bookmark.save();

    res
      .status(201)
      .send(`Created bookmark ${bookmark._id} for book ${bookmark.bookId}`);
  }
);

export { router as createBookmarkRouter };
