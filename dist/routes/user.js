"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_1 = require("../controllers/user");
const middleware_1 = require("../middleware");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get("/destroy", user_1.destroyUser);
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
exports.userRouter.get("/info", middleware_1.verifyAccessToken, user_1.getUser);
