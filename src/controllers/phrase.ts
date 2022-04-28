import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../model";
import Phrase from "../model/phrase";
import { Op } from "sequelize";

export const addPhrase = async (req: Request, res: Response) => {
  try {
    const { title, subheading, page, bookId } = req.body;
    await sequelize.transaction(async (t) => {
      const [phrase, created] = await Phrase.findOrCreate({
        where: { title, subheading, page, book_id: bookId },
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

export const getPhrases = async (req: Request, res: Response) => {
  try {
    const { limit, title, bookId } = req.query;
    const books = await Phrase.findAll({
      where: {
        title: { [Op.substring]: title as string },
        book_id: parseInt(bookId as string),
      },
      limit: parseInt(limit as string),
      order: ["page", "title"],
    });
    res.status(StatusCodes.OK).send(books);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err);
  }
};
