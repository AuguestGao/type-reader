import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  PageHistory,
} from "@type-reader/common";

import { natsWrapper } from "../nats-wrapper";
import { Stats } from "../model/stats";
import { Record, Key } from "../model/record";
import { StatsUpdatedPublisher } from "../events/publishers/stats-updated-publisher";

const router = Router();

router.patch(
  "/api/stats",
  requireAuth,
  [
    body("bookId")
      .exists()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Invalid bookId"),
    body("correctEntry")
      .exists()
      .isInt({ min: 0 })
      .withMessage("Invalid entry"),
    body("incorrectEntry")
      .exists()
      .isInt({ min: 0 })
      .withMessage("Invalid entry"),
    body("fixedEntry").exists().isInt({ min: 0 }).withMessage("Invalid entry"),
    body("readInSec").exists().isInt({ min: 0 }).withMessage("Invalid entry"),
    body("pageHistory").exists().isObject().withMessage("Invalid entry"),
    body("pageIndex").exists().isInt({ min: 0 }).withMessage("Invalid entry"),
    body("cursorIndex").exists().isString().withMessage("Invalid entry"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      bookId,
      correctEntry,
      incorrectEntry,
      fixedEntry,
      readInSec,
      pageIndex,
      cursorIndex,
    } = req.body;

    const pageHistory = req.body.pageHistory as PageHistory;

    const userId = req.currentUser!.id;
    const userStats = await Stats.findOne({ userId });

    if (!userStats) {
      throw new NotFoundError();
    }

    let entryHistory: Key[] = [];

    for (const page of Object.values(pageHistory)) {
      const { paragraphs } = page;

      for (let p of paragraphs) {
        const paragraphEntries = p.paragraphContent.map(
          ({ char, pressedKey, state }) => ({
            key: char,
            pressedKey,
            state,
          })
        );
        entryHistory = entryHistory.concat(paragraphEntries);
      }
    }

    const record = Record.build({
      bookId,
      correctEntry,
      incorrectEntry,
      fixedEntry,
      readInSec,
      entryHistory,
    });

    await record.save();

    userStats.totalReadInSec += readInSec;
    userStats.totalEntry += correctEntry + incorrectEntry + fixedEntry;
    userStats.records.push(record._id);

    await userStats.save();

    new StatsUpdatedPublisher(natsWrapper.client).publish({
      userId,
      bookId,
      readInSec,
      pageIndex,
      cursorIndex,
    });

    res.status(204).send();
  }
);

export { router as updateStatsRouter };
