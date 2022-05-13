import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@type-reader/common";

import { Bookmark } from "../model/bookmark";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.patch(
  "/api/bookmark",
  requireAuth,
  [
    body("bookId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Invalid bookId"),
    body("prevText").not().isEmpty(),
    body("pageIndex").isInt({ min: 0 }),
    body("readInSec").isInt({ min: 0 }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { bookId, prevText, pageIndex, readInSec } = req.body;

    const bookmark = await Bookmark.findOne({
      bookId,
      userId: req.currentUser!.id,
    });

    if (!bookmark) {
      console.log(bookmark);
      throw new NotFoundError();
    }

    await bookmark.refresh(prevText, pageIndex, readInSec);

    // ? change res body
    res.status(200).send({});
  }
);

export { router as updateBookmarkRouter };
