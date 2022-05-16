import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@type-reader/common";

import { natsWrapper } from "../nats-wrapper";
import { Stats } from "../model/stats";
import { StatsCreatedPublisher } from "../events/publishers/stats-created-publisher";

const router = Router();

router.post(
  "/api/stats",
  requireAuth,
  [
    body("bookId")
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Invalid bookId"),
    body("correctEntry")
      .notEmpty()
      .isInt()
      .custom((input: number) => input >= 0)
      .withMessage("Invalid entry"),
    body("incorrectEntry")
      .notEmpty()
      .isInt()
      .custom((input: number) => input >= 0)
      .withMessage("Invalid entry"),
    body("fixedEntry")
      .notEmpty()
      .isInt()
      .custom((input: number) => input >= 0)
      .withMessage("Invalid entry"),
    body("readInSec")
      .notEmpty()
      .isInt()
      .custom((input: number) => input >= 0)
      .withMessage("Invalid entry"),
    body("progress")
      .notEmpty()
      .isInt()
      .custom((input: number) => input >= 0)
      .withMessage("Invalid entry"),
    body("prevText").notEmpty(),
    body("pageIndex")
      .isInt({ min: 0 })
      .custom((input: number) => input >= 0)
      .withMessage("Invalid entry"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      bookId,
      correctEntry,
      incorrectEntry,
      fixedEntry,
      readInSec,
      prevText,
      pageIndex,
      progress,
    } = req.body;
    const userId = req.currentUser!.id;

    const newStats = Stats.build({
      userId,
      bookId,
      correctEntry,
      incorrectEntry,
      fixedEntry,
      readInSec,
    });
    await newStats.save();

    new StatsCreatedPublisher(natsWrapper.client).publish({
      userId,
      bookId,
      prevText,
      pageIndex,
      readInSec,
      progress,
    });

    res.status(201).send(`Created stats ${newStats._id}`);
  }
);

export { router as createStatsRouter };
