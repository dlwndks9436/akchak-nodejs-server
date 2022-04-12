import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const practiceValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("title", "Invalid title")
    .notEmpty()
    .withMessage("email is empty")
    .isLength({ min: 5 })
    .withMessage("title must be longer than 5 characters")
    .run(req);
  await body("duration", "Invalid duration")
    .notEmpty()
    .withMessage("duration is empty")
    .isNumeric()
    .withMessage("duration is not a number")
    .run(req);
  await body("from", "Invalid directory name")
    .notEmpty()
    .withMessage("directory name is empty")
    .run(req);
  await body("s3Key", "Invalid key")
    .notEmpty()
    .withMessage("key name is empty")
    .run(req);
  await body("practiceTime", "Invalid practice time")
    .notEmpty()
    .withMessage("practice time is empty")
    .isNumeric()
    .withMessage("practice time is not a number")
    .run(req);

  const result = validationResult(req);
  console.log("result: ", result);

  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};

export const practiceUpdateValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("title", "Invalid title")
    .notEmpty()
    .withMessage("email is empty")
    .isLength({ min: 5 })
    .withMessage("title must be longer than 5 characters")
    .run(req);
  const result = validationResult(req);
  console.log("result: ", result);
  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};
