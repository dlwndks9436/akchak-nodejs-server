import { Router } from "express";
import { addGoal, getGoals } from "../controllers/goal";
import { verifyAccessToken } from "../middleware";

export const goalRouter = Router();
/**
 * @swagger
 * /api/goal:
 *  post:
 *    tags:
 *    - Goal
 *    summary: 새로운 목표 추가
 *    description: 제공한 access token과 다른 입력들이 유효하면 새로운 목표를 생성합니다.
 *    operationId: create goal
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              phraseId:
 *                type: number
 *              musicId:
 *                type: number
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token과 phrase id, music id 중 하나가 유효하면 응답합니다. 새로운 목표를 데이터베이스에 저장합니다.
 *      400:
 *        description: access token이 유효하지만 phrase id, music id 둘 다 유효하지 않으면 응답합니다.
 *      401:
 *        description: 제공한 access token이 유효하지 않을 때 응답합니다.
 *      409:
 *        description: 동일한 목표가 이미 데이터베이스에 존재하면 응답합니다.
 */
goalRouter.post("/", verifyAccessToken, addGoal);
/**
 * @swagger
 * /api/goal:
 *  get:
 *    tags:
 *    - Goal
 *    summary: 목표 얻기
 *    description: 제공한 access token과 다른 입력들이 유효하면 기준에 맞는 목표들의 정보와 개수를 응답합니다.
 *    operationId: get goals
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
 *        name: type
 *        schema:
 *          type: string
 *      - in : query
 *        name: title
 *        schema:
 *          type: string
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token과 다른 입력들이 유효해서 기준에 맞는 목표들의 정보와 개수를 응답합니다.
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - type: object
 *                  properties:
 *                    goals:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                        created_at:
 *                          type: string
 *                        updated_at:
 *                          type: string
 *                        music_id:
 *                          type: integer
 *                        phrase_id:
 *                          type: integer
 *                        player_id:
 *                          type: integer
 *                        music:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: integer
 *                            title:
 *                              type: string
 *                            artist:
 *                              type: string
 *                    total_pages:
 *                      type: integer
 *                - type: object
 *                  properties:
 *                    goals:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                        created_at:
 *                          type: string
 *                        updated_at:
 *                          type: string
 *                        music_id:
 *                          type: integer
 *                        phrase_id:
 *                          type: integer
 *                        player_id:
 *                          type: integer
 *                        phrase:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: integer
 *                            title:
 *                              type: string
 *                            subheading:
 *                              type: string
 *                            page:
 *                              type: integer
 *                    total_pages:
 *                      type: integer
 *        401:
 *          description: 제공한 access token이 유효하지 않을 때 응답합니다.
 */
goalRouter.get("/", verifyAccessToken, getGoals);
