import { Router } from "express";
import { addPhrase, getPhrases } from "../controllers/phrase";
import {
  phraseAddInputValidator,
  phraseSearchInputValidator,
  verifyAccessToken,
} from "../middleware";

export const phraseRouter = Router();
/**
 * @swagger
 * /api/phrase:
 *  post:
 *    tags:
 *    - Phrase
 *    summary: 새로운 프레이즈 추가
 *    description: 제공한 access token과 다른 입력들이 유효하면 새로운 phrase를 생성합니다.
 *    operationId: create phrase
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              subheading:
 *                type: string
 *              page:
 *                type: number
 *              bookId:
 *                type: number
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token과 다른 입력들이 유효하면 응답합니다. 새로운 프레이즈를 데이터베이스에 저장합니다.
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
 *        description: 동일한 프레이즈가 이미 데이터베이스에 존재하면 응답합니다.
 */
phraseRouter.post("/", verifyAccessToken, phraseAddInputValidator, addPhrase);
/**
 * @swagger
 * /api/phrase:
 *  get:
 *    tags:
 *    - Phrase
 *    summary: 프레이즈 얻기
 *    description: 제공한 access token과 다른 입력들이 유효하면 기준에 맞는 프레이즈들의 정보와 개수를 응답합니다.
 *    operationId: get phrases
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
 *        name: bookId
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
 *        description: 제공한 access token과 다른 입력들이 유효해서 기준에 맞는 프레이즈들의 정보와 개수를 응답합니다.
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
 *                    subheading:
 *                      type: string
 *                    page:
 *                      type: integer
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
phraseRouter.get(
  "/",
  verifyAccessToken,
  phraseSearchInputValidator,
  getPhrases
);
