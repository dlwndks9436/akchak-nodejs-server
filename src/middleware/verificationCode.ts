import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import VerificationCode from "../model/verificationCode";

export const verifyVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const verificationCode = req.body.code;
  if (!verificationCode)
    return res
      .status(StatusCodes.FORBIDDEN)
      .send({ message: "인증코드가 확인되지 않았습니다" });
  await VerificationCode.findOne({ where: { player_id: req.playerId } })
    .then(async (code) => {
      if (code?.code === verificationCode) {
        await code!.destroy({ hooks: true });
        next();
      } else {
        return res
          .status(StatusCodes.FORBIDDEN)
          .send({ message: "유효한 인증코드가 아닙니다" });
      }
    })
    .catch((err: Error) => {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};
