import { Router } from "express";
import {
  checkDuplicatedEmail,
  checkDuplicatedUsername,
  loginValidator,
  signupValidator,
  verifyVerificationCode,
  verifyAccessToken,
} from "../middleware";
import {
  login,
  signup,
  changePassword,
  authorizeUser,
  getPlayerInfo,
  changePasswordById,
  deleteAccount,
} from "../controllers/player";
import { passwordValidator } from "../middleware/player";

export const playerRouter = Router();
/**
 * @swagger
 * /api/player:
 *  post:
 *    tags:
 *    - Player
 *    summary: 사용자 회원가입
 *    description: 사용자가 입력한 username, email, password이 유효성 검사를 통과하면 회원가입이 완료됩니다.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: "김아무개123"
 *              email:
 *                type: string
 *                example: "username@email-domain.com"
 *              password:
 *                type: string
 *                example: "mypassword1452!"
 *    operationId: signup
 *    responses:
 *      201:
 *        description: 사용자가 입력한 username, email, password가 모든 기준을 통과하여 회원가입이 완료되었습니다.
 *      400:
 *        description: 사용자가 입력한 username, email, password 중 하나라도 기준을 통과되지 못하면 실패한 원인을 응답으로 받습니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  value:
 *                    type: string
 *                  msg:
 *                    type: string
 *                  param:
 *                    type: string
 *                  location:
 *                    type: string
 *      409:
 *        description: 사용자가 입력한 email이나 username이 이미 다른 사용자가 이용 중이면 중복된 항목 관련된 정보를 응답으로 받습니다.
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
 *                msg: "이미 사용 중인 이메일입니다"
 *                param: "email"
 *                value: "username@email-domain.com"
 */
playerRouter.post(
  "/",
  signupValidator,
  checkDuplicatedEmail,
  checkDuplicatedUsername,
  signup
);
/**
 * @swagger
 * /api/player/login:
 *  post:
 *    tags:
 *    - Player
 *    summary: 사용자 로그인
 *    description: 사용자가 입력한 email과 password이 유효하면 사용자 정보와 토큰을 발급 받습니다.
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
 *                example: "myPassword1452!"
 *    responses:
 *      200:
 *        description: 사용자가 입력한 email과 password가 유효하므로, 해당되는 사용자 정보와 토큰을 발급 받습니다.
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
 *                authorized:
 *                  type: boolean
 *                banned_until:
 *                  type: object
 *              example:
 *                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ1MTk2MDYzLCJleHAiOjE2NDUxOTYxODN9.mXVh6rh-k54fB_KiD-4n-7vpzALWLAgB3d91CqwjBtk"
 *                refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ1NDI1NzgzLCJleHAiOjE2NDgwMTc3ODN9.SRxcjv0nWht25qDuzxPkn1OvnUQkJfG-v8VbOs5OpM4"
 *                id: 3
 *                username: 'username123'
 *                email: "username@email-domain.com"
 *                authorized: true
 *                banned_until: null
 *      400:
 *        description: 사용자가 입력한 email, password 중 하나라도 기준을 통과하지 못하면 실패한 원인을 응답으로 받습니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  value:
 *                    type: string
 *                  msg:
 *                    type: string
 *                  param:
 *                    type: string
 *                  location:
 *                    type: string
 *      401:
 *        description: 입력한 이메일이 유효하지만 비밀번호가 옳지 않을 경우 응답받습니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "비밀번호가 옳지 않습니다"
 *      404:
 *        description: 입력한 이메일을 사용하는 계정이 존재하지 않을 때 응답받습니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "존재하지 않는 계정입니다"
 */
playerRouter.post("/login", loginValidator, login);

/**
 * @swagger
 * /api/player/authorized:
 *  patch:
 *    tags:
 *    - Player
 *    summary: 사용자 앱 사용 권한 부여
 *    description: 입력한 인증코드가 계정에 저장된 인증코드와 일치하면 해당 계정이 앱 사용할 수 있도록 하고, 12시간 뒤에 계정이 자동소멸되는 것을 방지합니다.
 *    operationId: authorize user
 *    security:
 *    - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              code:
 *                type: string
 *                example: "XSrWTV"
 *    responses:
 *      200:
 *        description: 제공한 토큰에 해당되는 계정의 인증 코드와 입력한 인증 코드가 일치할 때 응답합니다. 계정을 자동으로 삭제하는 event를 삭제하고 계정의 authorized를 true로 설정하여 앱을 사용할 수 있도록 합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "이메일 인증 성공"
 *      401:
 *        description: 제공한 토큰이 유효하지 않을 때 응답합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "유효한 토큰이 아닙니다"
 *      403:
 *        description: 제공한 인증 코드가 유효하지 않을 때 응답합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "유효한 인증코드가 아닙니다"
 */
playerRouter.patch(
  "/authorized",
  verifyAccessToken,
  verifyVerificationCode,
  authorizeUser
);

/**
 * @swagger
 * /api/player/info:
 *  get:
 *    tags:
 *    - Player
 *    summary: 사용자 정보 제공
 *    description: 제공한 access token이 유효하면 사용자 정보를 제공합니다.
 *    operationId: get user's info
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token이 유효하면 사용자 정보를 제공합니다.
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
 *                authorized:
 *                  type: boolean
 *                banned_until:
 *                  type: object
 *              example:
 *                id: 3
 *                username: 'username123'
 *                email: "username@email-domain.com"
 *                authorized: true
 *                banned_until: null
 *      401:
 *       description: 제공한 access token이 유효하지 않을 때 응답합니다.
 */
playerRouter.get("/info", verifyAccessToken, getPlayerInfo);
/**
 * @swagger
 * /api/player/password/{playerId}:
 *  patch:
 *    tags:
 *    - Player
 *    summary: 기존 비밀번호를 이용한 비밀번호 변경
 *    desciprtion: 기존 비밀번호를 이용해서 사용자 인증을 한 후에 통과하면 제공한 새 비밀번호로 교체합니다.
 *    operationId: change user's password
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: playerId
 *        required: true
 *        schema:
 *          type: integer
 *          minimum: 1
 *        description: 사용자의 고유 번호
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              previousPassword:
 *                type: string
 *                example: "mypassword1452!"
 *              password:
 *                type: string
 *                example: "mynewpassword1452!"
 *    responses:
 *      200:
 *        description: 제공한 access token이 유효하고 새 비밀번호의 형식이 올바르면 응답합니다. 데이터베이스 비밀번호를 새 비밀번호로 바꿉니다.
 *      400:
 *       description: 제공한 새 비밀번호의 형식이 올바르지 않으면 응답합니다.
 *       content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  value:
 *                    type: string
 *                  msg:
 *                    type: string
 *                  param:
 *                    type: string
 *                  location:
 *                    type: string
 *      401:
 *        description: 찾는 사용자가 데이터베이스에 존재하지 않거나 기존 비밀번호가 옳지 않으면 응답합니다.
 *      406:
 *        description: 제공한 access token에 있는 사용자 정보와 path parameter로 제공한 사용자 정보가 일치하지 않을 때 응답합니다.
 *      409:
 *        description: 새 비밀번호가 기존 비밀번호와 일치할 때 응답합니다.
 */
playerRouter.patch(
  "/password/:playerId",
  verifyAccessToken,
  passwordValidator,
  changePasswordById
);
/**
 * @swagger
 * /api/player/password:
 *  patch:
 *    tags:
 *    - Player
 *    summary: 인증 코드를 이용한 비밀번호 변경
 *    description: 제공한 인증코드와 이메일이 유효하고 새 비밀번호의 형식이 올바르면 데이터베이스에 저장된 비밀번호를 제공한 것으로 변경합니다.
 *    operationId: change user's password with verification code
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
 *              code:
 *                type: string
 *                example: "XSrWTV"
 *              password:
 *                type: string
 *                example: "mynewpassword1452!"
 *    responses:
 *      200:
 *        description: 제공한 인증코드와 이메일이 유효하고 새 비밀번호의 형식이 올바를 때 응답합니다. 데이터베이스에 저장된 비밀번호를 새 비밀번호로 변경합니다.
 *      400:
 *       description: 제공한 새 비밀번호의 형식이 올바르지 않으면 응답합니다.
 *       content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  value:
 *                    type: string
 *                  msg:
 *                    type: string
 *                  param:
 *                    type: string
 *                  location:
 *                    type: string
 *      401:
 *        description: 제공한 이메일이나 인증코드가 유효하지 않을 때 응답합니다.
 *      404:
 *        description: 이메일로 사용자를 식별할 수 있었지만 코드가 데이터베이스에 존재하지 않을 때 응답합니다.
 *      409:
 *        description: 새 비밀번호가 기존 비밀번호와 일치할 때 응답합니다.
 */
playerRouter.patch("/password", passwordValidator, changePassword);
/**
 * @swagger
 * /api/player/account:
 *  delete:
 *    tags:
 *    - Player
 *    summary: 사용자 계정 삭제
 *    description: 제공한 access token이 유효하면 사용자 계정을 30일 후에 자동으로 삭제하는 event를 생성합니다.
 *    operationId: delete user's account
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token이 유효하면 응답합니다. 사용자가 앱 사용하지 못하도록하고, 30일 후에 계정이 삭제되는 event를 생성합니다.
 *      401:
 *        description: 제공한 access token이 유효하지 않을 때 응답합니다.
 */
playerRouter.delete("/account", verifyAccessToken, deleteAccount);
