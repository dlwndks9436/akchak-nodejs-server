import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { verificationCodeToEmail } from "../lib/functions/verificationCodeToEmail";
import { sequelize } from "../model";
import Player from "../model/player";
import VerificationCode from "../model/verificationCode";

export const issueVerificationCode = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const player = await Player.findOne({
        where: {
          email: req.body.email,
          unregistered_at: {
            [Op.is]: null,
          },
        },
        transaction: t,
      });
      if (player) {
        const result = await verificationCodeToEmail(
          player.id,
          player.email,
          player.username
        );
        if (result) {
          res
            .status(StatusCodes.OK)
            .send({ message: "사용자 이메일로 인증코드 전송됨" });
        } else {
          throw new Error("인증 코드 전송 과정 중에 에러 발생함");
        }
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: "권한이 없습니다" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err });
  }
};

export const checkVerificationCode = async (req: Request, res: Response) => {
  try {
    const player = await Player.findOne({
      where: {
        email: req.query.email as string,
        unregistered_at: {
          [Op.is]: null,
        },
      },
      raw: true,
    });
    if (player) {
      const code = await VerificationCode.findOne({
        where: { player_id: player.id },
      });
      if (code) {
        if (code.code === req.query.code) {
          await sequelize.query(
            "ALTER EVENT destroy_verification_code" +
              code.player_id +
              " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR DO DELETE FROM verification_code WHERE player_id = " +
              code.player_id
          );
          res.status(StatusCodes.OK).end();
        } else {
          res.status(StatusCodes.CONFLICT).end();
        }
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    } else {
      res.status(StatusCodes.UNAUTHORIZED).end();
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err });
  }
};
