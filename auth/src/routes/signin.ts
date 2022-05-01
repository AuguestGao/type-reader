import { Router, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest, BadRequestError } from "@type-reader/common";

import { Hash } from "../utils/hash";
import { User } from "../models/user";

const router = Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password")
      .isLength({ min: 3 })
      .withMessage("Invalid credential"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid credential.");
    }

    const passwordMatch = await Hash.compare(existingUser.password, password);

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credential.");
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        displayName: existingUser.displayName,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(`Successfully signed in ${existingUser.displayName}`);
  }
);

export { router as signinRouter };
