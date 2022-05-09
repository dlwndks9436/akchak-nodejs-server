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
    .withMessage("practice time is empty")
    .isNumeric()
    .withMessage("practice time is not a number")
    .run(req);
  await body("goalId", "Invalid goal id")
    .notEmpty()
    .withMessage("goal id is empty")
    .isNumeric()
    .withMessage("goal id is not a number")
    .run(req);
  await body("videoFileNameExt", "Invalid video file name with extension")
    .notEmpty()
    .withMessage("video file name with extension is empty")
    .run(req);
  await body("videoFileName", "Invalid video file name")
    .notEmpty()
    .withMessage("video file name is empty")
    .run(req);
  await body("videoPlaybackTime", "Invalid video playback time")
    .notEmpty()
    .withMessage("video playback time is empty")
    .isNumeric()
    .withMessage("video playback time is not a number")
    .run(req);
  await body("videoFileSize", "Invalid video file size")
    .notEmpty()
    .withMessage("video file size is empty")
    .isNumeric()
    .withMessage("video file size is not a number")
    .run(req);

  const result = validationResult(req);
  console.log("result: ", result);

  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};
