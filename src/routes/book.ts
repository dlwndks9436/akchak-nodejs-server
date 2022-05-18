import { Router } from "express";
import { addBook, getBooks } from "../controllers/book";
import {
  verifyAccessToken,
  bookInputValidator,
  bookSearchInputValidator,
} from "../middleware";

export const bookRouter = Router();
/**
 * @swagger
 * /api/book:
 *  post:
 *    tags:
 *    - Book
 *    summary: 새로운 교본 추가
 *    description: 제공한 access token과 다른 입력들이 유효하면 새로운 교본을 생성합니다.
 *    operationId: create book
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              author:
 *                type: string
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token과 다른 입력들이 유효하면 응답합니다. 새로운 교본을 데이터베이스에 저장합니다.
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
 *        description: 동일한 교본이 이미 데이터베이스에 존재하면 응답합니다.
 */
bookRouter.post("/", verifyAccessToken, bookInputValidator, addBook);
/**
 * @swagger
 * /api/book:
 *  get:
 *    tags:
 *    - Book
 *    summary: 교본 얻기
 *    description: 제공한 access token과 다른 입력들이 유효하면 기준에 맞는 교본들의 정보와 개수를 응답합니다.
 *    operationId: get books
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
 *        description: 제공한 access token과 다른 입력들이 유효해서 기준에 맞는 교본들의 정보와 개수를 응답합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                books:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                    title:
 *                      type: string
 *                    author:
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
bookRouter.get("/", verifyAccessToken, bookSearchInputValidator, getBooks);
