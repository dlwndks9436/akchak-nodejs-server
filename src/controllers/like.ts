import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../model";
import Like from "../model/like";

export const getLike = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const practiceId = req.params.practiceId;
      const rating = await Like.findOrCreate({
        where: { player_id: req.playerId, practicelog_id: practiceId },
        transaction: t,
        raw: true,
      });
      console.log(rating);

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
      const like = await Like.findOne({
        where: { player_id: req.playerId, practicelog_id: practiceId },
        transaction: t,
      });
      if (!like) {
        res.status(StatusCodes.NOT_FOUND).end();
      } else {
        like.is_like = !like.is_like;
        const newLike = await like.save({ transaction: t });
        res.status(StatusCodes.OK).send(newLike);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const countLikes = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const practiceIdStr = req.query.practiceLogId as string;
      const practiceId = parseInt(practiceIdStr, 10);
      console.log("practice id: ", practiceId);
      console.log("practice id string: ", practiceIdStr);

      const count = await Like.count({
        where: { practicelog_id: practiceId, is_like: true },
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
