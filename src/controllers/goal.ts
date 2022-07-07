import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Goal from "../model/goal";
import { getPagination } from "../lib/functions/getPagination";
import Music from "../model/music";
import Phrase from "../model/phrase";
import { Op } from "sequelize";
import Book from "../model/book";

export const addGoal = async (req: Request, res: Response) => {
  try {
    const { phraseId, musicId } = req.body;
    const playerId = req.playerId;
    if (!phraseId && !musicId) {
      res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      const [phrase, created] = await Goal.findOrCreate({
        where: {
          player_id: playerId,
          phrase_id: phraseId || null,
          music_id: musicId || null,
        },
      });
      if (!created) {
        res.status(StatusCodes.CONFLICT).end();
      } else {
        res.status(StatusCodes.OK).end();
      }
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const getGoals = async (req: Request, res: Response) => {
  try {
    const { page, size, type } = req.query;
    const { limit, offset } = getPagination(page as string, size as string);
    const title = req.query.title || "";
    let totalGoals = 0;
    let goals;
    if (type === "음악") {
      totalGoals = await Goal.count({
        where: {
          player_id: req.playerId,
          music_id: { [Op.gt]: 0 },
        },
      });
      goals = await Goal.findAll({
        where: { player_id: req.playerId, music_id: { [Op.gt]: 0 } },
        include: {
          model: Music,
          where: {
            title: { [Op.substring]: title as string },
          },
        },
        order: [["created_at", "DESC"]],
        limit,
        offset,
      });
    } else if (type === "교본") {
      totalGoals = await Goal.count({
        where: {
          player_id: req.playerId,
          phrase_id: { [Op.gt]: 0 },
        },
      });
      goals = await Goal.findAll({
        where: { player_id: req.playerId, phrase_id: { [Op.gt]: 0 } },
        include: [
          {
            model: Phrase,
            where: {
              title: { [Op.substring]: title as string },
            },
            include: [
              {
                model: Book,
                required: true,
                as: "book",
                attributes: ["title"],
              },
            ],
          },
        ],
        order: [["created_at", "DESC"]],
        limit,
        offset,
      });
    }
    console.log(goals);

    res.status(StatusCodes.OK).json({
      goals,
      total_pages: Math.ceil(totalGoals / parseInt(size as string)),
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};
