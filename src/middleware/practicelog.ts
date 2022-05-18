import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const practicelogCreateInputValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("time", "Invalid practice time")
    .notEmpty()
    .withMessage("연습 시간을 입력해주세요")
    .isNumeric()
    .withMessage("연습 시간을 숫자로만 입력해주세요")
    .run(req);
  await body("goalId", "Invalid goal id")
    .notEmpty()
    .withMessage("goal id를 입력해주세요")
    .isNumeric()
    .withMessage("goal id를 숫자로만 입력해주세요")
    .run(req);
  await body("videoFileNameExt", "Invalid video file name with extension")
    .notEmpty()
    .withMessage("videoFileNameExt을 입력해주세요")
    .run(req);
  await body("videoFileName", "Invalid video file name")
    .notEmpty()
    .withMessage("videoFileName을 입력해주세요")
    .run(req);
  await body("videoPlaybackTime", "Invalid video playback time")
    .notEmpty()
    .withMessage("videoPlaybackTime을 입력해주세요")
    .isNumeric()
    .withMessage("videoPlaybackTime을 숫자로만 입력해주세요")
    .run(req);
  await body("videoFileSize", "Invalid video file size")
    .notEmpty()
    .withMessage("videoFileSize을 입력해주세요")
    .isNumeric()
    .withMessage("videoFileSize을 숫자로만 입력해주세요")
    .run(req);

  const result = validationResult(req);
  console.log("result: ", result);

  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};
