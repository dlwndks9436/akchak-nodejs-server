import { Request, Response } from "express";
import Player from "../model/player";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import JWTToken from "../model/jwtToken";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../model";
import { verificationCodeToEmail } from "../lib/functions/verificationCodeToEmail";

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

      const authToken = await JWTToken.create(
        {
          player_id: player.id,
          token: refreshToken,
        },
        { transaction: t }
      );
      if (authToken) {
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

export const issueAuthCode = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const player = await Player.findOne({
        where: { id: req.playerId },
        transaction: t,
      });
      if (player) {
        const result = await verificationCodeToEmail(player.id, player.email);
        if (result) {
          res
            .status(StatusCodes.OK)
            .send({ message: "Auth code sent to player's email" });
        } else {
          throw new Error("Error occured during email sending process");
        }
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: "Invalid access." });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err });
  }
};

export const activateUser = async (req: Request, res: Response) => {
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
            res
              .status(StatusCodes.OK)
              .send({ message: "Player email successfully authenticated" });
          } else {
            throw new Error("Player does not exist");
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
