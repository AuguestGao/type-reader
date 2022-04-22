import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { Hash } from "../utils/hash";

import { validateRequest, BadRequestError } from "@type-reader/common";

import { User } from "../models/user";

const router = Router();

router.post(
  "/api/users/resetpassword",
  [
    body("answer").trim().isLength({ min: 3 }).withMessage("Incorrect answer"),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new BadRequestError("Unmatching passwords");
      }
      return true;
    }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const email = req.session?.email;

    if (!email) {
      throw new BadRequestError("Invalid request");
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Email not found.");
    }

    const { answer, password } = req.body;

    const answerMatch = await Hash.compare(existingUser.answer, answer);

    if (!answerMatch) {
      throw new BadRequestError("Wrong answer");
    }

    existingUser.password = password;

    await existingUser.save();

    req.session = null;

    res.status(200).send("Successfully reset password.");
  }
);

export { router as resetPasswordRouter };
