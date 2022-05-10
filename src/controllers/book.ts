import { Request, Response } from "express";
import { sequelize } from "../model";
import { StatusCodes } from "http-status-codes";
import Book from "../model/book";
import { Op } from "sequelize";
import { getPagination } from "../lib/functions/getPagination";

export const addBook = async (req: Request, res: Response) => {
  try {
    const { title, author } = req.body;
    await sequelize.transaction(async (t) => {
      const [book, created] = await Book.findOrCreate({
        where: { title, author },
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

export const getBooks = async (req: Request, res: Response) => {
  try {
    const { page, size } = req.query;
    const title = req.query.title || "";
    const { limit, offset } = getPagination(page as string, size as string);

    const totalBooks = await Book.count({
      where: {
        title: { [Op.substring]: title as string },
      },
    });

    const books = await Book.findAll({
      where: { title: { [Op.substring]: title as string } },
      limit,
      offset,
      order: ["title"],
    });
    res.status(StatusCodes.OK).json({
      books,
      total_pages: Math.ceil(totalBooks / parseInt(size as string)),
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err);
  }
};
