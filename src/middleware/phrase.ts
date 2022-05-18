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
    .withMessage("제목을 입력해주세요")
    .run(req);
  await body("page", "Invalid page")
    .notEmpty()
    .withMessage("page를 입력해주세요")
    .isNumeric()
    .withMessage("page를 숫자로만 입력해주세요")
    .run(req);
  await body("bookId", "Invalid book ID")
    .notEmpty()
    .withMessage("bookId를 입력해주세요")
    .isNumeric()
    .withMessage("bookId를 숫자로만 입력해주세요")
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
  await query("page", "Invalid page")
    .notEmpty()
    .withMessage("page를 입력해주세요")
    .isNumeric()
    .withMessage("page를 숫자로만 입력해주세요")
    .run(req);
  await query("size", "Invalid size")
    .notEmpty()
    .withMessage("size를 입력해주세요")
    .isNumeric()
    .withMessage("size를 숫자로만 입력해주세요")
    .run(req);
  await query("bookId", "Invalid book ID")
    .notEmpty()
    .withMessage("bookId를 입력해주세요")
    .isNumeric()
    .withMessage("bookId를 숫자로만 입력해주세요")
    .run(req);
  const result = validationResult(req);
  console.log("result: ", result);
  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};
