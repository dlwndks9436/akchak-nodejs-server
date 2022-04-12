import { Request, Response } from "express";
import User from "../model/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AuthToken from "../model/token";
import AuthCode from "../model/authCode";
import makeAuthCode from "../lib/functions/makeAuthCode";
import { sendMail } from "./mailer";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../model";

// TODO: add token logic in signup

export const signup = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  await User.create({
    username,
    email,
    password: bcrypt.hashSync(password),
  })
    .then(() => {
      res
        .status(StatusCodes.CREATED)
        .send({ message: "User registration complete." });
    })
    .catch((err) =>
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ ...err })
    );
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "The given email does not belong to any user" });
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message: "The given password does not match",
      });
    }
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: process.env.EXPIRATION_OF_ACCESS_TOKEN,
      }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: process.env.EXPIRATION_OF_REFRESH_TOKEN,
      }
    );

    const authToken = await AuthToken.create({
      user_id: user._id,
      body: refreshToken,
    });
    if (authToken) {
      res.status(StatusCodes.OK).send({
        accessToken,
        refreshToken,
        id: user._id,
        username: user.username,
        email: user.email,
        active: user.active,
        banned_until: user.banned_until,
      });
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: err,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  await AuthToken.destroy({
    where: { user_id: req.userId, body: req.token },
    individualHooks: true,
    hooks: true,
  })
    .then((deletedRecord) => {
      if (deletedRecord) {
        res.status(StatusCodes.OK).end();
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    })
    .catch(() => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    });
};

export const issueAuthCode = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { _id: req.userId } });
    if (user) {
      const result = await authCodeToEmail(user._id, user.email);
      if (result) {
        res
          .status(StatusCodes.OK)
          .send({ message: "Auth code sent to user's email" });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error occured during email sending process" });
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ message: "Invalid access." });
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err });
  }
};

export const activateUser = async (req: Request, res: Response) => {
  await sequelize
    .query("DROP EVENT IF EXISTS clearUser" + req.userId)
    .then(async () => {
      const user = await User.update(
        { active: true },
        { where: { _id: req.userId } }
      );
      if (user) {
        res
          .status(StatusCodes.OK)
          .send({ message: "User email successfully authenticated" });
      }
    })
    .catch((err) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    });
};

export const reissueAccessToken = async (req: Request, res: Response) => {
  const token = await AuthToken.findOne({
    where: { body: req.token, user_id: req.userId },
  });
  if (!token) {
    res.status(StatusCodes.BAD_REQUEST).send("Invalid access.");
  } else {
    const accessToken = jwt.sign(
      { id: req.userId },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: process.env.EXPIRATION_OF_ACCESS_TOKEN,
      }
    );
    const refreshToken = jwt.sign(
      { id: req.userId },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: process.env.EXPIRATION_OF_REFRESH_TOKEN,
      }
    );
    token.body = refreshToken;
    const updatedToken = await token.save();
    if (!updatedToken) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: "Issue occured while updating token" });
    } else {
      res.status(StatusCodes.OK).send({
        accessToken,
        refreshToken,
      });
    }
  }
};

const authCodeToEmail = async (
  userId: number,
  userEmail: string
): Promise<boolean> => {
  const authCode = makeAuthCode(6);
  try {
    const previousAuthCode = await AuthCode.findOne({
      where: { user_id: userId },
    });
    if (previousAuthCode) {
      await previousAuthCode.update({ code: authCode }).then(async () => {
        await sendMail(userEmail, authCode);
      });
    } else {
      await AuthCode.create({
        user_id: userId,
        code: authCode,
      }).then(async () => {
        await sendMail(userEmail, authCode);
      });
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};
