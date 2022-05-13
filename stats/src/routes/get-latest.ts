import { Router, Request, Response } from "express";
import { NotFoundError, requireAuth } from "@type-reader/common";

import { natsWrapper } from "../nats-wrapper";
import { Stats } from "../model/stats";

const router = Router();

router.get(
  "/api/stats/latest",
  requireAuth,
  async (req: Request, res: Response) => {
    const latestStats = await Stats.findOne({ userId: req.currentUser!.id })
      .sort({ timestamp: -1 })
      .select(["WPM", "netWPM", "accuracy", "KPM", "readInSec"]);

    if (!latestStats) {
      res.status(200).send({});
    }

    res.status(200).send(latestStats);
  }
);

export { router as getLatestStatsRouter };
