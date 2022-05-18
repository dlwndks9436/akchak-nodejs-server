import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

interface PlayerInterface {
  id: number;
}

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
      .send({ message: "토큰이 확인되지 않았습니다", expired: false });
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  jwt.verify(bearerToken, process.env.JWT_SECRET_KEY!, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: "유효한 토큰이 아닙니다", expired: true });
      } else {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: "유효한 토큰이 아닙니다", expired: false });
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
      .send({ message: "토큰이 확인되지 않았습니다" });
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, process.env.JWT_SECRET_KEY!, (err, decoded) => {
    if (err) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "유효한 토큰이 아닙니다" });
    }
    req.playerId = (decoded as PlayerInterface).id;
    req.token = bearerToken;
    next();
  });
};
