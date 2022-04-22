import { Router, Request, Response } from "express";
import { currentUser } from "@type-reader/common";

const router = Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  (req: Request, res: Response) => {
    res.status(200).send({ currentUser: req.currentUser || null });
  }
);

export { router as currentuserRouter };
