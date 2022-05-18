import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../model";
import JWTToken from "../model/jwtToken";
import jwt from "jsonwebtoken";

export const reissueAccessToken = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const token = await JWTToken.findOne({
        where: { token: req.token, player_id: req.playerId },
        transaction: t,
      });
      if (!token) {
        res.status(StatusCodes.BAD_REQUEST).send("올바르지 않는 접근입니다");
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

export const deleteToken = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      console.log(req.playerId, req.token);

      const deletedRecord = await JWTToken.destroy({
        where: { player_id: req.playerId, token: req.token },
        individualHooks: true,
        hooks: true,
        transaction: t,
      });
      if (deletedRecord) {
        await sequelize.query(
          `DROP EVENT IF EXISTS destroy_jwt_token${req.playerId}`,
          { transaction: t }
        );
        res.status(StatusCodes.OK).end();
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};
