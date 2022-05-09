import { Router, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest, BadRequestError } from "@type-reader/common";
import { UserCreatedPublisher } from "../events/publisher/user-created-publisher";
import { natsWrapper } from "../nats-wrapper";

import { User } from "../models/user";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("displayName")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Display name must not be empty")
      .escape(),
    body("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
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
    body("question")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Question must be at least 3 characters"),
    body("answer")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Answer must be at least 3 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { displayName, email, password, question, answer } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email is in use, try another one.");
    }

    const user = User.build({ displayName, email, password, question, answer });
    await user.save();

    new UserCreatedPublisher(natsWrapper.client).publish({
      id: user.id,
    });

    const userJwt = jwt.sign(
      {
        id: user.id,
        displayName: user.displayName,
      },
      process.env.JWT_KEY!
    );

    // store jwt in session
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(`Successfully signed up ${user.displayName}`);
  }
);

export { router as signupRouter };
