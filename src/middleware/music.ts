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
    .withMessage("제목을 입력해주세요")
    .run(req);
  await body("artist", "Invalid artist")
    .notEmpty()
    .withMessage("아티스트를 입력해주세요")
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
  const result = validationResult(req);
  console.log("result: ", result);
  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};
