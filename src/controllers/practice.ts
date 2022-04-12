import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getPagination } from "../lib/functions/getPagination";
import { getPagingData } from "../lib/functions/getPagingData";
import Practice from "../model/practice";
import User from "../model/user";
import Sequelize from "sequelize";
import getSignedS3URL from "../lib/functions/getSignedS3URL";
import { sequelize } from "../model";
import AWS from "aws-sdk";

export const createPractice = async (req: Request, res: Response) => {
  try {
    const fromDirectory = req.body.from;
    const title = req.body.title;
    const description = req.body.description;
    const duration = req.body.duration;
    const practiceTime = req.body.practiceTime;
    const s3Key = req.body.s3Key;

    await Practice.create({
      user_id: req.userId,
      title,
      description,
      duration,
      from_directory: fromDirectory,
      practice_time: practiceTime,
      s3_key: s3Key,
    });

    res.status(StatusCodes.OK).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const getPractices = async (req: Request, res: Response) => {
  const { page, size, title, username } = req.query;
  const condition: { title?: any; username?: any } | undefined =
    title || username ? {} : undefined;
  if (title) {
    condition!.title = { [Sequelize.Op.like]: `%${title}%` };
  }
  if (username) {
    condition!.username = { [Sequelize.Op.like]: `%${username}%` };
  }
  const { limit, offset } = getPagination(page as string, size as string);
  Practice.findAndCountAll({
    where: condition,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [{ model: User, required: true, attributes: ["username"] }],
  })
    .then((data) => {
      console.log("find all practice result: ", data);
      const response = getPagingData(data, page as string, limit);
      res.status(StatusCodes.OK).send(response);
    })
    .catch((err) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

export const getPracticeById = async (req: Request, res: Response) => {
  try {
    const practiceId = req.params.practiceId;
    const userId = req.userId;
    const result = await sequelize.transaction(async (t) => {
      const practice = await Practice.findOne({
        where: { _id: practiceId },
        include: [{ model: User, required: true }],
        transaction: t,
      });
      if (!practice) {
        return null;
      }
      const isOwner = userId === practice.user_id;
      await practice.update({ views: practice.views + 1 }, { transaction: t });
      const signedUrl = getSignedS3URL({
        bucket: process.env.BUCKET!,
        key: practice.s3_key,
      });
      return { practice, signedUrl, isOwner };
    });
    if (result) {
      res.status(StatusCodes.OK).send(result);
    } else {
      res.status(StatusCodes.NOT_FOUND).send({ message: "Practice not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

export const updatePractice = async (req: Request, res: Response) => {
  try {
    const practiceId = req.params.practiceId;
    const userId = req.userId;
    const { title, description } = req.body;
    const result = await sequelize.transaction(async (t) => {
      const practice = await Practice.update(
        { title, description },
        {
          where: { _id: practiceId, user_id: userId },
          transaction: t,
        }
      );
      return practice[0] > 0;
    });
    if (result) {
      res.status(StatusCodes.OK).end();
    } else {
      res.status(StatusCodes.NOT_FOUND).send({ message: "Practice not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

export const deletePractice = async (req: Request, res: Response) => {
  try {
    const practiceId = req.params.practiceId;
    const userId = req.userId;
    const result = await sequelize.transaction(async (t) => {
      const practice = await Practice.findOne({
        where: { _id: practiceId, user_id: userId },
        transaction: t,
      });
      const s3 = new AWS.S3();
      const bucketParams1 = {
        Bucket: process.env.BUCKET!,
        Key: practice?.s3_key.split(".")[0] + ".jpg",
      };
      const bucketParams2 = {
        Bucket: process.env.BUCKET!,
        Key: practice?.s3_key!,
      };
      s3.deleteObject(bucketParams1, (err, data) => {
        if (err) {
          throw err;
        }
        console.log("s3 delete thumbnail ", data);
      });
      s3.deleteObject(bucketParams2, (err, data) => {
        if (err) {
          throw err;
        }
        console.log("s3 delete video ", data);
      });
      await practice?.destroy({ transaction: t });
      return true;
    });
    if (result) {
      res.status(StatusCodes.OK).end();
    } else {
      res.status(StatusCodes.NOT_FOUND).send({ message: "Practice not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};
