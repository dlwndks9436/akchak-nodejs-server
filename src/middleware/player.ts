import { Request, Response, NextFunction } from "express";
import Player from "../model/player";
import VerificationCode from "../model/verificationCode";
import { StatusCodes } from "http-status-codes";
import { body, validationResult } from "express-validator";

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
    .withMessage("이메일을 입력해주세요")
    .isEmail()
    .withMessage("올바른 이메일 형식으로 입력해주세요")
    .normalizeEmail()
    .run(req);
  await body("username", "Invalid username")
    .notEmpty()
    .withMessage("닉네임을 입력해주세요")
    .if((_: any, { req }: any) => {
      return req.body.username.length >= 3 && req.body.username.length <= 15;
    })
    .withMessage("닉네임을 3~15자 이내로 입력해주세요")
    .matches(/^[가-힣|a-z|A-Z|0-9|]+$/)
    .withMessage("닉네임을 한글, 영어, 숫자로 만들어주세요")
    .run(req);
  await body("password", "Invalid password")
    .notEmpty()
    .withMessage("비밀번호를 입력해주세요")
    .matches(/^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,16}$/)
    .withMessage(
      "비밀번호를 8자 이상 16자 이하, 영어, 숫자, 특수문자로 만들어주세요"
    )
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
    .withMessage("이메일을 입력해주세요")
    .isEmail()
    .withMessage("이메일을 올바른 형식으로 입력해주세요")
    .normalizeEmail()
    .run(req);
  await body("password", "Invalid password")
    .notEmpty()
    .withMessage("비밀번호를 입력해주세요")
    .matches(/^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,16}$/)
    .withMessage("비밀번호를 올바른 형식으로 입력해주세요")
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
    .withMessage("비밀번호를 입력해주세요")
    .matches(/^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,16}$/)
    .withMessage(
      "비밀번호를 8자 이상 16자 이하, 영어, 숫자, 특수문자로 만들어주세요"
    )
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
