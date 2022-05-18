import { Router } from "express";
import { reissueAccessToken, deleteToken } from "../controllers/jwtToken";
import { verifyRefreshToken } from "../middleware";

export const jwtTokenRouter = Router();

/**
 * @swagger
 * /api/token:
 *  patch:
 *    tags:
 *    - JWT Token
 *    summary: access token 재발급
 *    description: 헤더에 있는 refresh token을 검증해서 통과하면 새로운 access token을 발급합니다.
 *    operationId: reissue access token
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 refresh token이 유효해서 새로운 access token과 refresh token을 발급해서 응답합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ1MTk2MDYzLCJleHAiOjE2NDUxOTYxODN9.mXVh6rh-k54fB_KiD-4n-7vpzALWLAgB3d91CqwjBtk"
 *                refreshToken:
 *                  type: string
 *                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ1NDI1NzgzLCJleHAiOjE2NDgwMTc3ODN9.SRxcjv0nWht25qDuzxPkn1OvnUQkJfG-v8VbOs5OpM4"
 *      400:
 *        description: 제공한 refresh token과 안에 저장된 계정 정보와 일치하는 것이 데이터베이스에 없을 때 응답합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "올바르지 않는 접근입니다"
 *      401:
 *        description: 제공한 refresh token이 유효하지 않을 때 응답합니다
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "유효한 토큰이 아닙니다"
 */
jwtTokenRouter.patch("/", verifyRefreshToken, reissueAccessToken);
/**
 * @swagger
 * /api/token:
 *  delete:
 *    tags:
 *    - JWT Token
 *    summary: refresh token 삭제
 *    description: 제공한 refresh token 정보와 일치하는 것이 데이터베이스에 있으면 refresh token을 데이터베이스에서 삭제합니다.
 *    operationId: delete refresh token
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 refresh token이 유효하면 데이터베이스에서 refresh token을 삭제하고, refresh token을 30일 주기로 자동으로 삭제하는 event도 삭제합니다.
 *      401:
 *        description: 제공한 refresh token이 유효하지 않을 때 응답합니다
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "유효한 토큰이 아닙니다"
 *      404:
 *        description: 제공한 refresh token이 유효하지만 데이터베이스에 refresh token이 존재하지 않으면 응답합니다.
 */
jwtTokenRouter.delete("/", verifyRefreshToken, deleteToken);
