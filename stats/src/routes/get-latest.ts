import { Router, Request, Response } from "express";
import { NotFoundError, requireAuth } from "@type-reader/common";

import { Stats } from "../model/stats";

const router = Router();

router.get(
  "/api/stats/latest",
  requireAuth,
  async (req: Request, res: Response) => {
    const stats = await Stats.findOne(
      {
        userId: req.currentUser!.id,
      },
      { records: { $slice: -1 } }
    ).populate({
      path: "records",
      select: [
        "readInSec",
        "totalEntry",
        "accuracy",
        "wpm",
        "netWpm",
        "kpm",
        "createdAt",
      ],
    });

    if (!stats) {
      throw new NotFoundError();
    }

    res.status(200).send(stats.records[0]);
  }
);

export { router as getLatestStatsRouter };
