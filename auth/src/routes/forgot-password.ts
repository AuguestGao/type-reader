import { Router, Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, BadRequestError } from "@type-reader/common";

import { User } from "../models/user";

const router = Router();

router.post(
  "/api/users/forgotpassword",
  [body("email").isEmail().withMessage("Email must be valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("No such an Email");
    }

    req.session = {
      email: existingUser.email,
    };

    res.status(200).send({ question: existingUser.question });
  }
);

export { router as forgotPasswordRouter };
