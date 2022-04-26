import { Request, Response } from "express";
import { sequelize } from "../model";
import { StatusCodes } from "http-status-codes";
import Book from "../model/book";

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

// export const getBooks = async (req: Request, res: Response) => {
//  try {
//    const { limit, title } = req.query;
//    await
//  } catch (err) {
//   console.log(err);

//  }
// }
