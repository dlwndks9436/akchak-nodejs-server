import { Router } from "express";
import { addMusic, getMusics } from "../controllers/music";
import {
  verifyAccessToken,
  musicInputValidator,
  musicSearchInputValidator,
} from "../middleware";

export const musicRouter = Router();
/**
 * @swagger
 * /api/music:
 *  post:
 *    tags:
 *    - Music
 *    summary: 새로운 음악 추가
 *    description: 제공한 access token과 다른 입력들이 유효하면 새로운 음악을 생성합니다.
 *    operationId: create music
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              artist:
 *                type: string
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token과 다른 입력들이 유효하면 응답합니다. 새로운 음악을 데이터베이스에 저장합니다.
 *      400:
 *        description: access token이 유효하지만 다른 입력값들 중 하나라도 유효하지 않으면 응답합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      value:
 *                        type: string
 *                      msg:
 *                        type: string
 *                      param:
 *                        type: string
 *                      location:
 *                        type: string
 *      401:
 *        description: 제공한 access token이 유효하지 않을 때 응답합니다.
 *      409:
 *        description: 동일한 음악이 이미 데이터베이스에 존재하면 응답합니다.
 */
musicRouter.post("/", verifyAccessToken, musicInputValidator, addMusic);
/**
 * @swagger
 * /api/music:
 *  get:
 *    tags:
 *    - Music
 *    summary: 음악 얻기
 *    description: 제공한 access token과 다른 입력들이 유효하면 기준에 맞는 음악들의 정보와 개수를 응답합니다.
 *    operationId: get musics
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *      - in: query
 *        name: size
 *        schema:
 *          type: integer
 *      - in : query
 *        name: title
 *        schema:
 *          type: string
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token과 다른 입력들이 유효해서 기준에 맞는 음악들의 정보와 개수를 응답합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                phrases:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                    title:
 *                      type: string
 *                    artist:
 *                      type: string
 *                total_pages:
 *                  type: integer
 *      400:
 *        description: access token이 유효하지만 다른 입력값들 중 하나라도 유효하지 않으면 응답합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      value:
 *                        type: string
 *                      msg:
 *                        type: string
 *                      param:
 *                        type: string
 *                      location:
 *                        type: string
 *      401:
 *        description: 제공한 access token이 유효하지 않을 때 응답합니다.
 */
musicRouter.get("/", verifyAccessToken, musicSearchInputValidator, getMusics);
