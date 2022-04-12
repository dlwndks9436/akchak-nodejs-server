import { Router } from "express";
import { changeRating, countRatings, getRating } from "../controllers/rating";
import { verifyAccessToken } from "../middleware";

export const ratingRouter = Router();
/**
 * @swagger
 * /rating/number:
 *  get:
 *   tags:
 *   - Rating
 *   summary: Get total count of rating
 *   operationId: get total count of rating
 *   security:
 *   - bearerAuth: []
 *   responses:
 *    200:
 *     description: Given access token is verified and searching practice exists therefore get total count of rating
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         practices:
 *          type: number
 *    401:
 *     description: Given access token is not valid
 *    404:
 *     description: Practice not found
 */
ratingRouter.get("/number", verifyAccessToken, countRatings);
/**
 * @swagger
 * /rating/{id}:
 *  get:
 *   tags:
 *   - Rating
 *   summary: Get current rating rated by user
 *   operationId: get current rating
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: integer
 *      description:
 *   security:
 *   - bearerAuth: []
 *   responses:
 *    200:
 *     description: Given access token is verified and practice exists therefore get current rating rated by user
 *    401:
 *     description: Given access token is not valid
 *    404:
 *     description: Practice not found
 */
ratingRouter.get("/:practiceId", verifyAccessToken, getRating);
/**
 * @swagger
 * /rating/{id}:
 *  patch:
 *   tags:
 *   - Rating
 *   summary: Change current rating rated by user
 *   operationId: change current rating
 *   paramters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: integer
 *      description: The numeric value of practice id
 *   security:
 *   - bearerAuth: []
 *   responses:
 *    200:
 *     description: Given access token is verified and practice exists therefore change current rating rated by user
 *    401:
 *     description: Given access token is not valid
 *    404:
 *     description: Practice not found
 */
ratingRouter.patch("/:practiceId", verifyAccessToken, changeRating);
