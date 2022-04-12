import { Router } from "express";
import { destroyUser, getUser } from "../controllers/user";
import { verifyAccessToken } from "../middleware";

export const userRouter = Router();

userRouter.get("/destroy", destroyUser);
/**
 * @swagger
 * /user/info:
 *  get:
 *    tags:
 *    - User
 *    summary: Get user's info
 *    operationId: get user's info
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: Given access token is verified therefore provide user info
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                username:
 *                  type: string
 *                email:
 *                  type: string
 *                active:
 *                  type: boolean
 *                banned_until:
 *                  type: object
 *              example:
 *                id: 3
 *                username: 'username123'
 *                email: "username@email-domain.com"
 *                active: true
 *                banned_until: null
 *      401:
 *       description: Given access token is not valid
 */
userRouter.get("/info", verifyAccessToken, getUser);
