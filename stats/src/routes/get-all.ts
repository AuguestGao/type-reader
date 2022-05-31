import { Router, Request, Response } from "express";
import { NotFoundError, requireAuth } from "@type-reader/common";

import { Stats } from "../model/stats";

const router = Router();

router.get("/api/stats", requireAuth, async (req: Request, res: Response) => {
  const userStats = await Stats.findOne({
    userId: req.currentUser!.id,
  }).populate("records");

  if (!userStats) {
    throw new NotFoundError();
  }

  const { totalReadInSec, totalEntry } = userStats;

  res.status(200).send({ totalEntry, totalReadInSec });
});

export { router as getAllStatsRouter };
