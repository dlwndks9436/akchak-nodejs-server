import { NextFunction, Request, Response } from "express";
import { body, query, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const phraseAddInputValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("title", "Invalid title")
    .notEmpty()
    .withMessage("title is empty")
    .run(req);
  await body("page", "Invalid page")
    .notEmpty()
    .withMessage("page is empty")
    .isNumeric()
    .withMessage("page is not a number")
    .run(req);
  await body("bookId", "Invalid book ID")
    .notEmpty()
    .withMessage("book ID is empty")
    .isNumeric()
    .withMessage("book ID is not a number")
    .run(req);
  const result = validationResult(req);
  console.log("result: ", result);
  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};

export const phraseSearchInputValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await query("limit", "Invalid limit")
    .notEmpty()
    .withMessage("limit is empty")
    .isNumeric()
    .withMessage("limit is not a number")
    .run(req);
  await query("bookId", "Invalid book ID")
    .notEmpty()
    .withMessage("book ID is empty")
    .isNumeric()
    .withMessage("book ID is not a number")
    .run(req);
  const result = validationResult(req);
  console.log("result: ", result);
  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};
