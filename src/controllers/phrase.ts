import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../model";
import Phrase from "../model/phrase";
import { Op } from "sequelize";
import { getPagination } from "../lib/functions/getPagination";
import Book from "../model/book";

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
    const { bookId, page, size } = req.query;
    const title = req.query.title || "";
    const { limit, offset } = getPagination(page as string, size as string);

    const totalPhrases = await Phrase.count({
      where: {
        title: { [Op.substring]: title as string },
        book_id: parseInt(bookId as string),
      },
    });

    const phrases = await Phrase.findAll({
      where: {
        title: { [Op.substring]: title as string },
        book_id: parseInt(bookId as string),
      },
      include: [
        {
          model: Book,
          required: true,
          as: "book",
          attributes: ["title"],
        },
      ],
      limit,
      offset,
      order: ["page", "title"],
    });
    res.status(StatusCodes.OK).json({
      phrases,
      total_pages: Math.ceil(totalPhrases / parseInt(size as string)),
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err);
  }
};
