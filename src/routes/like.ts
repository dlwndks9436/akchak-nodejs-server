import { Router } from "express";
import { changeLike, countLikes, getLike } from "../controllers/like";
import { verifyAccessToken } from "../middleware";

export const likeRouter = Router();
/**
 * @swagger
 * /api/like/count:
 *  get:
 *   tags:
 *   - Like
 *   summary: 제공한 access token이 유효하면 좋아요 받은 개수를 응답합니다.
 *   operationId: get total count of likes
 *   security:
 *   - bearerAuth: []
 *   parameters:
 *     - in: query
 *       name: practiceLogId
 *       schema:
 *         type: integer
 *   responses:
 *    200:
 *     description: 제공한 access token이 유효하므로 해당 연습 기록이 받은 좋아요 개수를 응답합니다.
 *     content:
 *      application/json:
 *       schema:
 *        type: integer
 *    401:
 *     description: 제공한 access token이 유효하지 않을 때 응답합니다.
 */
likeRouter.get("/count", verifyAccessToken, countLikes);
/**
 * @swagger
 * /api/like/{id}:
 *  get:
 *   tags:
 *   - Like
 *   summary: 제공한 access token이 유효하면 사용자가 해당 연습기록을 좋아요한 여부를 응답합니다.
 *   operationId: get current like of player
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: integer
 *      description: 사용자의 고유번호
 *   security:
 *   - bearerAuth: []
 *   responses:
 *    200:
 *     description: 제공한 access token이 유효하므로 사용자 해당 연습 기록을 좋아요한 여부를 응답합니다.
 *    401:
 *     description: 제공한 access token이 유효하지 않을 때 응답합니다.
 */
likeRouter.get("/:practiceId", verifyAccessToken, getLike);
/**
 * @swagger
 * /api/like/{id}:
 *  patch:
 *   tags:
 *   - Like
 *   summary: 제공한 access token이 유효하면 사용자의 좋아요 여부를 반대로 바꿉니다.
 *   operationId: change current rating
 *   paramters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: integer
 *      description: 연습 기록의 고유 번호
 *   security:
 *   - bearerAuth: []
 *   responses:
 *    200:
 *     description: 제공한 access token과 사용자 고유 번호가 유효했을 때 응답합니다. 사용자의 좋아요 여부를 반대로 바꿔서 like 정보를 제공합니다.
 *    401:
 *     description: 제공한 access token이 유효하지 않을 때 응답합니다.
 *    404:
 *     description: 좋아요 정보를 찾을 수 없을 때 응답합니다.
 */
likeRouter.patch("/:practiceId", verifyAccessToken, changeLike);
