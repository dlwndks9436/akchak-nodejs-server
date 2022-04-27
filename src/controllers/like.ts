import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../models";
import Like from "../models/like";

export const getLike = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const practiceId = req.params.practiceId;
      const rating = await Like.findOrCreate({
        where: { player_id: req.playerId, practice_log_id: practiceId },
        transaction: t,
      });
      if (!rating) {
        res.status(StatusCodes.NOT_FOUND).end();
      }
      res.status(StatusCodes.OK).send(rating);
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const changeLike = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const practiceId = req.params.practiceId;
      const isLike = req.body.isLike;
      const rating = await Like.update(
        { is_like: isLike },
        {
          where: { player_id: req.playerId, practice_log_id: practiceId },
          transaction: t,
        }
      );
      if (!rating) {
        res.status(StatusCodes.NOT_FOUND).end();
      }
      res.status(StatusCodes.OK).send(rating);
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const countLikes = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const practiceIdStr = req.query.practiceId as string;
      const practiceId = parseInt(practiceIdStr, 10);
      console.log("practice id: ", practiceId);
      console.log("practice id string: ", practiceIdStr);

      const count = await Like.count({
        where: { practice_log_id: practiceId, is_like: true },
        transaction: t,
      });
      console.log("count: ", count);
      res.status(StatusCodes.OK).send({ count });
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};
