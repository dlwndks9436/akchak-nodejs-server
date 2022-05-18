import { Router } from "express";
import {
  checkVerificationCode,
  issueVerificationCode,
} from "../controllers/verificationCode";

export const verificationCodeRouter = Router();

/**
 * @swagger
 * /api/verification-code:
 *  post:
 *    tags:
 *    - Verification Code
 *    summary: 인증코드 발급
 *    description: 사용자가 입력한 email이 유효하면 새로운 인증 코드를 발급해서 email로 발송합니다.
 *    operationId: issue verification code
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
 *    responses:
 *      200:
 *        description: 입력받은 이메일을 사용하는 계정이 확인되어서 해당 이메일로 새로운 인증코드 발송합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "사용자 이메일로 인증코드 전송됨."
 *      400:
 *        description: 입력받은 이메일을 사용하는 계정이 확인되지 않았을 때 응답합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "권한이 없습니다."
 */
verificationCodeRouter.post("/", issueVerificationCode);

/**
 * @swagger
 * /api/verification-code:
 *  get:
 *    tags:
 *    - Verification Code
 *    summary: 인증코드 검사
 *    description: email, 인증코드를 입력받아서 해당 계정의 인증 코드와 비교하여 결과를 응답합니다.
 *    operationId: check verification code
 *    parameters:
 *      - in: query
 *        name: email
 *        schema:
 *          type: string
 *        description: 본인 계정에 사용하는 email
 *      - in: query
 *        name: code
 *        schema:
 *          type: integer
 *        description: 발급 받은 인증 코드
 *    responses:
 *      200:
 *        description: 입력한 인증코드와 계정에 저장된 인증코드가 일치할 때 응답합니다.
 *      401:
 *        description: 입력한 이메일를 사용하는 계정이 없을 때 응답합니다.
 *      404:
 *        description: 해당 계정에 발급된 인증 코드가 없을 때 응답합니다.
 *      409:
 *        description: 입력한 인증코드와 계정에 저장된 인증코드가 일치하지 않을 때 응답합니다.
 */
verificationCodeRouter.get("/", checkVerificationCode);
