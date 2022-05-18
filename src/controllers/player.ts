import { Request, Response } from "express";
import Player from "../model/player";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import JWTToken from "../model/jwtToken";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../model";
import VerificationCode from "../model/verificationCode";
import { Op } from "sequelize";

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
        res.status(StatusCodes.CREATED).end();
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
          unregistered_at: {
            [Op.is]: null,
          },
        },
        transaction: t,
      });
      if (!player) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: "존재하지 않는 계정입니다" });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        player.password
      );
      if (!passwordIsValid) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          message: "비밀번호가 옳지 않습니다",
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

export const authorizeUser = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      await sequelize
        .query("DROP EVENT IF EXISTS clearPlayer" + req.playerId, {
          transaction: t,
        })
        .then(async () => {
          const player = await Player.update(
            { authorized: true },
            {
              where: {
                id: req.playerId,
                unregistered_at: {
                  [Op.is]: null,
                },
              },
              transaction: t,
            }
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

export const getPlayerInfo = async (req: Request, res: Response) => {
  const player = await Player.findOne({
    where: {
      id: req.playerId,
      unregistered_at: {
        [Op.is]: null,
      },
    },
  });
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
      const player = await Player.findOne({
        where: {
          email,
          unregistered_at: {
            [Op.is]: null,
          },
        },
      });
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

export const changePasswordById = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      if (req.playerId !== parseInt(req.params.playerId)) {
        res.status(StatusCodes.NOT_ACCEPTABLE).end();
      }
      const { password, previousPassword } = req.body;

      const player = await Player.findOne({
        where: {
          id: req.playerId,
          unregistered_at: {
            [Op.is]: null,
          },
        },
      });
      if (!player) {
        res.status(StatusCodes.UNAUTHORIZED).end();
        console.log("해당 유저가 존재하지 않습니다");
      } else {
        if (!bcrypt.compareSync(previousPassword, player?.password as string)) {
          console.log("비밀번호가 옳지 않습니다");

          res.status(StatusCodes.UNAUTHORIZED).end();
        } else if (bcrypt.compareSync(password, player?.password as string)) {
          res.status(StatusCodes.CONFLICT).end();
        } else {
          await player.update(
            { password: bcrypt.hashSync(password) },
            { transaction: t }
          );
          res.status(StatusCodes.OK).end();
        }
      }
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const player = await Player.findOne({
        where: {
          id: req.playerId,
          unregistered_at: {
            [Op.is]: null,
          },
        },
        transaction: t,
      });
      if (player) {
        await sequelize.query(
          `CREATE EVENT destroy_player${player.id} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 30 DAY DO DELETE FROM player WHERE id = ${player.id}`,
          {
            transaction: t,
          }
        );
        await sequelize.query(
          `DROP EVENT IF EXISTS destroy_jwt_token${req.playerId}`,
          { transaction: t }
        );
        await player.update(
          { unregistered_at: new Date() },
          { transaction: t }
        );
        res.status(StatusCodes.OK).end();
      } else {
        res.status(StatusCodes.UNAUTHORIZED).end();
      }
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};
