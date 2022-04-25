import { Request, Response } from "express";
import Player from "../model/player";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import JWTToken from "../model/jwtToken";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../model";
import { verificationCodeToEmail } from "../lib/functions/verificationCodeToEmail";
import VerificationCode from "../model/verificationCode";

export const signup = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const { username, password, email } = req.body;
      const player = await Player.create(
        {
          username,
          email,
          password: bcrypt.hashSync(password),
        },
        { transaction: t }
      );
      if (player) {
        res
          .status(StatusCodes.CREATED)
          .send({ message: "Player registration complete." });
      }
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const { email } = req.body;
      const player = await Player.findOne({
        where: {
          email,
        },
        transaction: t,
      });
      if (!player) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: "The given email does not belong to any player" });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        player.password
      );
      if (!passwordIsValid) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          message: "The given password does not match",
        });
      }
      const accessToken = jwt.sign(
        { id: player.id },
        process.env.JWT_SECRET_KEY!,
        {
          expiresIn: process.env.EXPIRATION_OF_ACCESS_TOKEN,
        }
      );
      const refreshToken = jwt.sign(
        { id: player.id },
        process.env.JWT_SECRET_KEY!,
        {
          expiresIn: process.env.EXPIRATION_OF_REFRESH_TOKEN,
        }
      );
      const previousToken = await JWTToken.findOne({
        where: { player_id: player.id },
      });
      if (previousToken) {
        await previousToken.update({ token: refreshToken }, { transaction: t });
        res.status(StatusCodes.OK).send({
          accessToken,
          refreshToken,
          id: player.id,
          username: player.username,
          email: player.email,
          authorized: player.authorized,
          banned_until: player.banned_until,
        });
      } else {
        const jwtToken = await JWTToken.create(
          {
            player_id: player.id,
            token: refreshToken,
          },
          { transaction: t }
        );
        if (jwtToken) {
          res.status(StatusCodes.OK).send({
            accessToken,
            refreshToken,
            id: player.id,
            username: player.username,
            email: player.email,
            authorized: player.authorized,
            banned_until: player.banned_until,
          });
        }
      }
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: err,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      await JWTToken.destroy({
        where: { player_id: req.playerId, token: req.token },
        individualHooks: true,
        hooks: true,
        transaction: t,
      }).then((deletedRecord) => {
        if (deletedRecord) {
          res.status(StatusCodes.OK).end();
        } else {
          res.status(StatusCodes.NOT_FOUND).end();
        }
      });
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const issueVerificationCode = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const player = await Player.findOne({
        where: { email: req.body.email },
        transaction: t,
      });
      if (player) {
        const result = await verificationCodeToEmail(player.id, player.email);
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
      where: { email: req.query.email as string },
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

export const authorizeUser = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      await sequelize
        .query("DROP EVENT IF EXISTS clearUser" + req.playerId, {
          transaction: t,
        })
        .then(async () => {
          const player = await Player.update(
            { authorized: true },
            { where: { id: req.playerId }, transaction: t }
          );
          if (player) {
            res.status(StatusCodes.OK).send({ message: "이메일 인증 성공" });
          } else {
            throw new Error("유효하지 않는 접근입니다");
          }
        });
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

export const reissueAccessToken = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const token = await JWTToken.findOne({
        where: { token: req.token, player_id: req.playerId },
        transaction: t,
      });
      if (!token) {
        res.status(StatusCodes.BAD_REQUEST).send("Invalid access.");
      } else {
        const accessToken = jwt.sign(
          { id: req.playerId },
          process.env.JWT_SECRET_KEY!,
          {
            expiresIn: process.env.EXPIRATION_OF_ACCESS_TOKEN,
          }
        );
        const refreshToken = jwt.sign(
          { id: req.playerId },
          process.env.JWT_SECRET_KEY!,
          {
            expiresIn: process.env.EXPIRATION_OF_REFRESH_TOKEN,
          }
        );
        token.token = refreshToken;
        const updatedToken = await token.save({ transaction: t });
        if (!updatedToken) {
          throw new Error("Issue occured while updating token");
        } else {
          res.status(StatusCodes.OK).send({
            accessToken,
            refreshToken,
          });
        }
      }
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

export const getPlayerInfo = async (req: Request, res: Response) => {
  const player = await Player.findOne({ where: { id: req.playerId } });
  if (player) {
    res.status(StatusCodes.OK).send({
      id: req.playerId,
      username: player.username,
      email: player.email,
      authorized: player.authorized,
      banned_until: player.banned_until,
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).end();
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const { email, code, password } = req.body;
      const player = await Player.findOne({ where: { email } });
      if (!player) {
        res.status(StatusCodes.UNAUTHORIZED).end();
      } else {
        const verificationCode = await VerificationCode.findOne({
          where: { player_id: player?.id },
        });
        if (!verificationCode) {
          res.status(StatusCodes.NOT_FOUND).end();
        } else if (verificationCode?.code !== code) {
          res.status(StatusCodes.UNAUTHORIZED).end();
        } else if (bcrypt.compareSync(password, player?.password as string)) {
          res.status(StatusCodes.CONFLICT).end();
        } else {
          await player.update(
            { password: bcrypt.hashSync(password) },
            { transaction: t }
          );
          await verificationCode.destroy({ transaction: t });
          res.status(StatusCodes.OK).end();
        }
      }
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};
