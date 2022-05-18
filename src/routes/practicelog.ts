import { Router } from "express";
import {
  createPracticelog,
  deletePracticelog,
  getPracticelogById,
  getPracticelogs,
  getRecentPracticeTime,
} from "../controllers/practicelog";
import {
  verifyAccessToken,
  practicelogCreateInputValidator,
} from "../middleware";

export const practicelogRouter = Router();
/**
 * @swagger
 * /api/practicelog:
 *  post:
 *    tags:
 *    - Practice Log
 *    summary: 새로운 연습 기록 생성
 *    description: 제공한 access token과 입력들을 검사한 후 모두 통과하면 새로운 연습 기록을 생성합니다.
 *    operationId: create practice log
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              time:
 *                type: number
 *              goalId:
 *                type: number
 *              memo:
 *                type: string
 *              videoFileNameExt:
 *                type: string
 *              videoFileName:
 *                type: string
 *              videoPlaybackTime:
 *                type: number
 *              videoFileSize:
 *                type: number
 *            example:
 *              time: 201
 *              goalId: 2
 *              videoFileNameExt: "12412512521.mp4"
 *              videoFileName: "12412512521"
 *              videoPlaybackTime: 120
 *              videoFileSize: 221
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token과 다른 입력들이 유효하면 새로운 연습 기록을 생성합니다.
 *      400:
 *        description: 제공한 입력들이 유효하지 않으면 응답합니다.
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
 *
 */
practicelogRouter.post(
  "/",
  verifyAccessToken,
  practicelogCreateInputValidator,
  createPracticelog
);
/**
 * @swagger
 * /api/practicelog/time:
 *  get:
 *    tags:
 *    - Practice Log
 *    summary: 최근 연습 시간 제공
 *    description: 제공한 access token이 유효하면 사용자가 최근에 연습한 시간을 제공합니다.
 *    operationId: check practice time
 *    parameters:
 *      - in: query
 *        name: timezone
 *        schema:
 *          type: string
 *        description: 사용자가 위치한 timezone
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token과 timezone이 유효하면 최근 연습 시간을 제공합니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: number
 *      401:
 *        description: 제공한 access token이 유효하지 않을 때 응답합니다.
 *      406:
 *        description: 제공한 timezone이 유효하지 않을 때 응답합니다.
 */
practicelogRouter.get("/time", verifyAccessToken, getRecentPracticeTime);
/**
 * @swagger
 * /api/practicelog/{id}:
 *  get:
 *    tags:
 *    - Practice Log
 *    summary: practice log 정보 제공
 *    description: 제공한 access token과 practice log id가 유효하면 해당되는 practice log의 정보를 제공합니다.
 *    operationId: get practice by Id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: The numeric value of practice id
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token과 practice log id가 유효하면 응답합니다.video의 url를 새로 발급하고 practice log의 정보를 제공합니다. 사용자가 practice log의 주인이 아닐 경우 조회수 1 올려서 저장합니다.
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - type: object
 *                  properties:
 *                    id:
 *                      type: number
 *                    playerName:
 *                      type: string
 *                    phraseTitle:
 *                      type: string
 *                    phraseSubheading:
 *                      type: string
 *                    bookTitle:
 *                      type: string
 *                    view:
 *                      type: number
 *                    playbackTime:
 *                      type: number
 *                    createdAt:
 *                      type: string
 *                    memo:
 *                      type: string
 *                    videoUrl:
 *                      type: string
 *                    isOwner:
 *                      type: boolean
 *                - type: object
 *                  properties:
 *                    id:
 *                      type: number
 *                    playerName:
 *                      type: string
 *                    musicTitle:
 *                      type: string
 *                    musicArtist:
 *                      type: string
 *                    view:
 *                      type: number
 *                    playbackTime:
 *                      type: number
 *                    createdAt:
 *                      type: string
 *                    memo:
 *                      type: string
 *                    videoUrl:
 *                      type: string
 *                    isOwner:
 *                      type: boolean
 *      401:
 *        description: 제공한 access token이 유효하지 않을 때 응답합니다.
 *      404:
 *        description: 찾는 연습 기록이 존재하지 않을 때 응답합니다.
 */
practicelogRouter.get("/:practiceId", verifyAccessToken, getPracticelogById);
/**
 * @swagger
 * /api/practicelog:
 *  get:
 *    tags:
 *    - Practice Log
 *    summary: 최근 연습 기록들 제공
 *    descroption: pagination 구현을 위해서 최근 연습 기록들을 page 단위로 제공합니다.
 *    operationId: get practices
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: 찾고자하는 연습 기록들의 page
 *      - in: query
 *        name: size
 *        schema:
 *          type: integer
 *        description: 찾고자하는 연습 기록들의 개수
 *      - in: query
 *        name: type
 *        schema:
 *          type: string
 *        description: 찾고자하는 연습 기록들의 종류(ex 음악, 프레이즈)
 *      - in: query
 *        name: query
 *        schema:
 *          type: string
 *        description: 찾고자하는 연습 기록들의 상세내용
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token가 유효하면 응답합니다. thumbnail url를 새로 발급하고 practice log들의 정보와 총 page 수를 제공합니다.
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - type: object
 *                  properties:
 *                    results:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: number
 *                          playerName:
 *                            type: string
 *                          phraseTitle:
 *                            type: string
 *                          phraseSubheading:
 *                            type: string
 *                          bookTitle:
 *                            type: string
 *                          view:
 *                            type: number
 *                          playbackTime:
 *                            type: number
 *                          thumbnailUrl:
 *                            type: string
 *                          createdAt:
 *                            type: string
 *                    totalPages:
 *                      type: number
 *                - type: object
 *                  properties:
 *                    results:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: number
 *                          playerName:
 *                            type: string
 *                          musicTitle:
 *                            type: string
 *                          musicArtist:
 *                            type: string
 *                          view:
 *                            type: number
 *                          playbackTime:
 *                            type: number
 *                          thumbnailUrl:
 *                            type: string
 *                          createdAt:
 *                            type: string
 *                    totalPages:
 *                      type: number
 *      401:
 *        description: 제공한 access token이 유효하지 않을 때 응답합니다.
 */
practicelogRouter.get("/", verifyAccessToken, getPracticelogs);

/**
 * @swagger
 * /api/practicelog/{id}:
 *  delete:
 *    tags:
 *    - Practice Log
 *    summary: 연습 기록 삭제
 *    description: 제공한 access token과 practice log id가 유효하면 aws s3 bucket에서 관련 파일들을 제거한 후에 연습 기록을 삭제합니다.
 *    operationId: delete practice log
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: 삭제할 연습 기록의 고유번호
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: 제공한 access token과 practice log id가 유효하면 응답합니다. aws s3 bucket에서 동영상과 섬네일을 삭제한 후에 데이터베이스에서 연습 기록을 삭제합니다.
 *      401:
 *        description: 제공한 access token이 유효하지 않을 때 응답합니다.
 *      404:
 *        description: 삭제하려는 연습 기록이 존재하지 않을 때 응답합니다.
 */
practicelogRouter.delete("/:practiceId", verifyAccessToken, deletePracticelog);
