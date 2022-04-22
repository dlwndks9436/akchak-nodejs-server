import { Request, Response } from "express";
import User from "../model/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AuthToken from "../model/jwtToken";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../model";
import { authCodeToEmail } from "src/lib/functions/authCodeToEmail";

export const signup = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const { username, password, email } = req.body;
      const user = await User.create(
        {
          username,
          email,
          password: bcrypt.hashSync(password),
        },
        { transaction: t }
      );
      if (user) {
        res
          .status(StatusCodes.CREATED)
          .send({ message: "User registration complete." });
      }
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const { email } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
        transaction: t,
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

      const authToken = await AuthToken.create(
        {
          user_id: user._id,
          body: refreshToken,
        },
        { transaction: t }
      );
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
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: err,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      await AuthToken.destroy({
        where: { user_id: req.userId, body: req.token },
        individualHooks: true,
        hooks: true,
        transaction: t,
      }).then((deletedRecord) => {
        if (deletedRecord) {
          res.status(StatusCodes.OK).end();
        } else {
          res.status(StatusCodes.NOT_FOUND).end();
        }
      });
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const issueAuthCode = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const user = await User.findOne({
        where: { _id: req.userId },
        transaction: t,
      });
      if (user) {
        const result = await authCodeToEmail(user._id, user.email);
        if (result) {
          res
            .status(StatusCodes.OK)
            .send({ message: "Auth code sent to user's email" });
        } else {
          throw new Error("Error occured during email sending process");
        }
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: "Invalid access." });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err });
  }
};

export const activateUser = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      await sequelize
        .query("DROP EVENT IF EXISTS clearUser" + req.userId, {
          transaction: t,
        })
        .then(async () => {
          const user = await User.update(
            { active: true },
            { where: { _id: req.userId }, transaction: t }
          );
          if (user) {
            res
              .status(StatusCodes.OK)
              .send({ message: "User email successfully authenticated" });
          } else {
            throw new Error("User does not exist");
          }
        });
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

export const reissueAccessToken = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async (t) => {
      const token = await AuthToken.findOne({
        where: { body: req.token, user_id: req.userId },
        transaction: t,
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
        const updatedToken = await token.save({ transaction: t });
        if (!updatedToken) {
          throw new Error("Issue occured while updating token");
        } else {
          res.status(StatusCodes.OK).send({
            accessToken,
            refreshToken,
          });
        }
      }
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};
