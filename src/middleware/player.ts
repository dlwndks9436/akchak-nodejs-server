import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PlayerInterface } from "../interface/AuthRequest";
import Player from "../model/player";
import VerificationCode from "../model/verificationCode";
import { StatusCodes } from "http-status-codes";
import { body, validationResult } from "express-validator";

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("access token 검증 시작");

  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Access token is not provided", expired: false });
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  jwt.verify(bearerToken, process.env.JWT_SECRET_KEY!, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: "Given access token is not valid", expired: true });
      } else {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: "Given access token is not valid", expired: false });
      }
    }
    req.playerId = (decoded as PlayerInterface).id;
    next();
  });
};

export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "No token provided." });
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, process.env.JWT_SECRET_KEY!, (err, decoded) => {
    if (err) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Invalid token provided" });
    }
    req.playerId = (decoded as PlayerInterface).id;
    req.token = bearerToken;
    next();
  });
};

export const verifyVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const verificationCode = req.body.code;
  if (!verificationCode)
    return res
      .status(StatusCodes.FORBIDDEN)
      .send({ message: "인증코드가 확인되지 않았습니다" });
  await VerificationCode.findOne({ where: { player_id: req.playerId } })
    .then(async (code) => {
      if (code?.code === verificationCode) {
        await code!.destroy({ hooks: true });
        next();
      } else {
        return res
          .status(StatusCodes.FORBIDDEN)
          .send({ message: "Given verification code is not valid" });
      }
    })
    .catch((err: Error) => {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

export const checkDuplicatedUsername = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Player.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (user) {
        res.status(StatusCodes.CONFLICT).send({
          msg: "이미 사용 중인 닉네임입니다",
          param: "username",
          value: req.body.username,
        });
        return;
      }
      next();
    })
    .catch((err) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        ...err,
      });
    });
};

export const checkDuplicatedEmail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Player.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (user) {
        res.status(StatusCodes.CONFLICT).send({
          msg: "이미 사용 중인 이메일입니다",
          param: "email",
          value: req.body.email,
        });
        return;
      }
      next();
    })
    .catch((err) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        ...err,
      });
    });
};

export const signupValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("email", "Invalid email")
    .notEmpty()
    .withMessage("email is empty")
    .isEmail()
    .withMessage("invalid email form")
    .normalizeEmail()
    .run(req);
  await body("username", "Invalid username")
    .notEmpty()
    .withMessage("username is empty")
    .matches(/^(?=.*[a-z])[a-zA-Z0-9]{8,20}$/i)
    .withMessage("username does not meet criteria")
    .run(req);
  await body("password", "Invalid password")
    .notEmpty()
    .withMessage("password is empty")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
    .withMessage("password does not meet criteria")
    .run(req);
  const result = validationResult(req);
  console.log("result: ", result);

  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};

export const loginValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("email", "Invalid email")
    .notEmpty()
    .withMessage("email is empty")
    .isEmail()
    .withMessage("invalid email form")
    .normalizeEmail()
    .run(req);
  await body("password", "Invalid password")
    .notEmpty()
    .withMessage("password is empty")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
    .withMessage("password does not meet requirements")
    .run(req);
  const result = validationResult(req);
  console.log("result: ", result);

  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};

export const passwordValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("password", "Invalid password")
    .notEmpty()
    .withMessage("password is empty")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
    .withMessage("password does not meet requirements")
    .run(req);
  const result = validationResult(req);
  console.log("result: ", result);

  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: result.array() });
  }
  next();
};

//Email:  At least one letter, 8~20 letters and digists

/*
/^
  (?=.*\d)          // should contain at least one digit
  (?=.*[a-z])       // should contain at least one lower case
  (?=.*[A-Z])       // should contain at least one upper case
  [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
$/
*/
