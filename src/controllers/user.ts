import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../model/user";

export const destroyUser = async (req: Request, res: Response) => {
  User.destroy({ where: { _id: 1 }, individualHooks: true });
  res.status(StatusCodes.OK).send({ message: "OK" });
};

export const getUser = async (req: Request, res: Response) => {
  const user = await User.findOne({ where: { _id: req.userId } });
  if (user) {
    res.status(StatusCodes.OK).send({
      id: req.userId,
      username: user.username,
      email: user.email,
      active: user.active,
      banned_until: user.banned_until,
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).end();
  }
};
