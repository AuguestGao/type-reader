import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@type-reader/common";

import { Bookmark } from "../model/bookmark";
import { body } from "express-validator";

const router = Router();

router.get(
  "/api/bookmark",
  body("bookId")
    .exists()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("Invalid bookId"),
  requireAuth,
  async (req: Request, res: Response) => {
    const { bookId } = req.body;

    const bookmark = await Bookmark.findOne({
      bookId,
    });

    if (!bookmark) {
      throw new NotFoundError();
    }

    if (bookmark.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const { pageIndex, cursorIndex, totalSecOnBook, prevText } = bookmark;

    res.status(200).send({ pageIndex, cursorIndex, totalSecOnBook, prevText });
  }
);

export { router as getBookmarkRouter };
