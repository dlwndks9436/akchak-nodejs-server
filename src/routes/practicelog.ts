import { Router } from "express";
import {
  createPracticelog,
  deletePracticelog,
  getPracticelogById,
  getPracticelogs,
  updatePracticelog,
} from "../controllers/practicelog";
import {
  verifyAccessToken,
  practicelogCreateInputValidator,
} from "../middleware";

export const practicelogRouter = Router();
/**
 * @swagger
 * /practice:
 *  post:
 *    tags:
 *    - Practice
 *    summary: Create practice
 *    operationId: create practice
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              fileName:
 *                type: string
 *              from:
 *                type: string
 *              duration:
 *                type: number
 *              practiceTime:
 *                type: number
 *            example:
 *              title: First attempt of playing Lemon tree
 *              description: The song was not hard as I expected and it was very delightful to play.
 *              fileName: adf87g6987asdf68asd5f65
 *              from: 123152626134
 *              duration: 12353
 *              pracitceTime: 121215
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: Given access token is verified therefore create practice
 *      400:
 *        description: Given input is not valid
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
 *                    example:
 *                      - value: ""
 *                        msg: "title is empty"
 *                        param: "title"
 *                        location: "body"
 *                      - value: ""
 *                        msg: "practice time is empty"
 *                        param: "practiceTime"
 *                        location: "body"
 *                      - value: ""
 *                        msg: "practice time is not a number"
 *                        param: "practiceTime"
 *                        location: "body"
 *      401:
 *        description: Given access token is not valid
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
 * /practice/{id}:
 *  get:
 *    tags:
 *    - Practice
 *    summary: Get practice by Id
 *    operationId: get practice by Id
 *    parameters:
 *      - in : path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: The numeric value of practice id
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: Given access token is verified and searching practice exists therefore get practices
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                practices:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: number
 *                    user_id:
 *                      type: number
 *                    title:
 *                      type: string
 *                    description:
 *                      type: string
 *                    duration:
 *                      type: number
 *                    from:
 *                      type: string
 *                    practice_time:
 *                      type: number
 *                    s3_key:
 *                      type: string
 *                    views:
 *                      type: number
 *                    createdAt:
 *                      type: string
 *                    updatedAt:
 *                      type: string
 *                    user:
 *                      type: object
 *                      properties:
 *                        username:
 *                          type: string
 *                signedUrl:
 *                  type: string
 *                isOwner:
 *                  type: boolean
 *      401:
 *        description: Given access token is not valid
 *      404:
 *        description: Practice not found
 */
practicelogRouter.get("/:practiceId", verifyAccessToken, getPracticelogById);
/**
 * @swagger
 * /practice:
 *  get:
 *    tags:
 *    - Practice
 *    summary: Get practices
 *    operationId: get practices
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: The numeric value of current page
 *      - in: query
 *        name: size
 *        schema:
 *          type: integer
 *        description: The numbers of items to return
 *      - in: query
 *        name: title
 *        schema:
 *          type: string
 *        description: Search practices while title contains given value
 *      - in: query
 *        name: username
 *        schema:
 *          type: string
 *        description: Search practices which username contains given value
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: Given access token is verified therefore get practices
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                practices:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: number
 *                      user_id:
 *                        type: number
 *                      title:
 *                        type: string
 *                      description:
 *                        type: string
 *                      duration:
 *                        type: number
 *                      from:
 *                        type: string
 *                      practice_time:
 *                        type: number
 *                      s3_key:
 *                        type: string
 *                      views:
 *                        type: number
 *                      createdAt:
 *                        type: string
 *                      updatedAt:
 *                        type: string
 *                      user:
 *                        type: object
 *                        properties:
 *                          username:
 *                            type: string
 *                        example:
 *                          username: username1234
 *                totalItems:
 *                  type: number
 *                totalPages:
 *                  type: number
 *                currentPage:
 *                  type: number
 *                thumbnailURLs:
 *                  type: array
 *                  items:
 *                    type: string
 *      401:
 *        description: Given access token is not valid
 */
practicelogRouter.get("/", verifyAccessToken, getPracticelogs);

/**
 * @swagger
 * /practice/{id}:
 *  delete:
 *    tags:
 *    - Practice
 *    summary: Delete practice
 *    operationId: delete practice
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
 *        description: Given access token is verified and practice exists therefore delete practice
 *      401:
 *        description: Given access token is not valid
 *      404:
 *        description: Practice not found
 */
practicelogRouter.delete("/:practiceId", verifyAccessToken, deletePracticelog);
