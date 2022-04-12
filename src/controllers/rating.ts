import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../model";
import Rating from "../model/rating";

export const getRating = async (req: Request, res: Response) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const practiceId = req.params.practiceId;
      const rating = await Rating.findOrCreate({
        where: { user_id: req.userId, practice_id: practiceId },
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

export const changeRating = async (req: Request, res: Response) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const practiceId = req.params.practiceId;
      const isLike = req.body.isLike;
      const rating = await Rating.update(
        { isLike },
        {
          where: { user_id: req.userId, practice_id: practiceId },
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

export const countRatings = async (req: Request, res: Response) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const practiceIdStr = req.query.practiceId as string;
      const practiceId = parseInt(practiceIdStr, 10);
      console.log("practice id: ", practiceId);
      console.log("practice id string: ", practiceIdStr);

      const count = await Rating.count({
        where: { practice_id: practiceId, isLike: true },
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
