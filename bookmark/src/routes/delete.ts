import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@type-reader/common";

import { Bookmark } from "../model/bookmark";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.delete(
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

    const bookmark = await Bookmark.findOneAndDelete({
      bookId,
      userId: req.currentUser!.id,
    });

    // ! change res body
    res.status(200).send(bookmark);
  }
);

export { router as deleteBookmarkRouter };
