"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../controllers/auth");
exports.authRouter = (0, express_1.Router)();
/**
 * @swagger
 * /auth/signup:
 *  post:
 *    tags:
 *    - Auth
 *    summary: Signup
 *    description: Validate user input and create user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: "username123"
 *              email:
 *                type: string
 *                example: "username@email-domain.com"
 *              password:
 *                type: string
 *                example: "yourComplexPassword1452"
 *    operationId: signup
 *    responses:
 *      201:
 *        description: User's input meets criterea therefore create user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "User registration complete."
 *      400:
 *        description: User input did not pass validation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/validation-error'
 *      409:
 *        description: User already exists using given inputs
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                param:
 *                  type: string
 *                  enum: [username, email]
 *                value:
 *                  type: string
 *              example:
 *                msg: "Provided username is already occupied."
 *                param: "username"
 *                value: "username123"
 */
exports.authRouter.post("/signup", middleware_1.signupValidator, middleware_1.checkDuplicatedEmail, middleware_1.checkDuplicatedUsername, auth_1.signup);
/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags:
 *    - Auth
 *    summary: Login
 *    description: Verifies a user and return tokens
 *    operationId: login
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: "username@email-domain.com"
 *              password:
 *                type: string
 *                example: "yourComplexPassword1452"
 *    responses:
 *      200:
 *        description: User is recognized and token is sent
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                refreshToken:
 *                  type: string
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
 *                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ1MTk2MDYzLCJleHAiOjE2NDUxOTYxODN9.mXVh6rh-k54fB_KiD-4n-7vpzALWLAgB3d91CqwjBtk"
 *                refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ1NDI1NzgzLCJleHAiOjE2NDgwMTc3ODN9.SRxcjv0nWht25qDuzxPkn1OvnUQkJfG-v8VbOs5OpM4"
 *                id: 3
 *                username: 'username123'
 *                email: "username@email-domain.com"
 *                active: true
 *                banned_until: null
 *      400:
 *        description: User input did not pass validation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/validation-error'
 *      401:
 *        description: The given password does not match
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "The given password does not match"
 *      404:
 *        description: The given email does not belong to any user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "The given email does not belong to any user"
 */
exports.authRouter.post("/login", middleware_1.loginValidator, auth_1.login);
/**
 * @swagger
 * /auth/code:
 *  get:
 *    tags:
 *    - Auth
 *    summary: Issue auth code
 *    description: Verifies access token and issue auth code
 *    operationId: issue auth code
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Access token is verified and auth code is sent to user's email
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Auth code sent to user's email."
 *      400:
 *        description: Given access token belongs to non existing user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Invalid access."
 *      401:
 *        description: Given access token is not valid
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Given access token is not valid"
 *                expired:
 *                  type: boolean
 *                  example: false
 */
exports.authRouter.get("/code", middleware_1.verifyAccessToken, auth_1.issueAuthCode);
/**
 * @swagger
 * /auth/activate-user:
 *  post:
 *    tags:
 *    - Auth
 *    summary: Activate user's account
 *    description: Check auth code to determine authenticated user and activate account
 *    operationId: activate user
 *    security:
 *    - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              authCode:
 *                type: string
 *                example: "XSrWTV"
 *    responses:
 *      200:
 *        description: Given access token and auth code is verified therefore activated user's account
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "User email is successfully authenticated"
 *      401:
 *        description: Given access token is not valid
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Given access token is not valid"
 *      403:
 *        description: Given auth code is not valid
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Given auth code is not valid"
 */
exports.authRouter.post("/activate-user", middleware_1.verifyAccessToken, middleware_1.verifyAuthCode, auth_2.activateUser);
/**
 * @swagger
 * /auth/token:
 *  patch:
 *    tags:
 *    - Auth
 *    summary: Reissue access token
 *    description: Reissue user's access token
 *    operationId: reissue access token
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: Given refresh token is verified therefore reissue access token
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/tokens'
 *      400:
 *        description: Given refresh token belongs to non existing user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Invalid access."
 *      401:
 *        description: Given refresh token is not valid
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Given access token is not valid"
 */
exports.authRouter.patch("/token", middleware_1.verifyRefreshToken, auth_1.reissueAccessToken);
/**
 * @swagger
 * /auth/token:
 *  delete:
 *    tags:
 *    - Auth
 *    summary: Delete access token
 *    description: Delete token in database
 *    operationId: delete token
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: Given refresh token is verified therefore delete corresponding token in database
 *      401:
 *        description: Given refresh token is not valid
 *      404:
 *        description: Given refresh token is verified but corresponding token does not exit in database
 */
exports.authRouter.delete("/token", middleware_1.verifyRefreshToken, auth_1.logout);