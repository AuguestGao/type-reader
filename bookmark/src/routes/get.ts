import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@type-reader/common";

import { natsWrapper } from "../nats-wrapper";
import { Bookmark } from "../model/bookmark";

const router = Router();

router.get(
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

    const bookmark = await Bookmark.findOne({
      bookId,
      userId: req.currentUser!.id,
    });

    if (!bookmark) {
      throw new NotFoundError();
    }

    res.status(200).send(bookmark);
  }
);

export { router as getBookmarkRouter };
