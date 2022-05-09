import { NextFunction, Request, Response } from "express";
import { body, query, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const musicInputValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("title", "Invalid title")
    .notEmpty()
    .withMessage("title is empty")
    .run(req);
  await body("artist", "Invalid artist")
    .notEmpty()
    .withMessage("artist is empty")
    .run(req);
  const result = validationResult(req);
  console.log("result: ", result);
  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};

export const musicSearchInputValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await query("page", "Invalid page")
    .notEmpty()
    .withMessage("page is empty")
    .isNumeric()
    .withMessage("page is not a number")
    .run(req);
  await query("size", "Invalid size")
    .notEmpty()
    .withMessage("size is empty")
    .isNumeric()
    .withMessage("size is not a number")
    .run(req);
  const result = validationResult(req);
  console.log("result: ", result);
  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};
