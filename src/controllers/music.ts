import { Request, Response } from "express";
import { sequelize } from "../model";
import { StatusCodes } from "http-status-codes";
import Music from "../model/music";
import { Op } from "sequelize";
import { getPagination } from "../lib/functions/getPagination";

export const addMusic = async (req: Request, res: Response) => {
  try {
    const { title, artist } = req.body;
    await sequelize.transaction(async (t) => {
      const [music, created] = await Music.findOrCreate({
        where: { title, artist },
      });
      if (!created) {
        res.status(StatusCodes.CONFLICT).end();
      } else {
        res.status(StatusCodes.OK).end();
      }
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const getMusics = async (req: Request, res: Response) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page as string, size as string);
    const title = req.query.title || "";

    const totalMusics = await Music.count({
      where: {
        title: { [Op.substring]: title as string },
      },
    });

    const musics = await Music.findAll({
      where: { title: { [Op.substring]: title as string } },
      limit,
      offset,
      order: ["title"],
    });
    res.status(StatusCodes.OK).json({
      musics,
      total_pages: Math.ceil(totalMusics / parseInt(size as string)),
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err);
  }
};
