import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getPagination } from "../lib/functions/getPagination";
import { getPagingData } from "../lib/functions/getPagingData";
import Practicelog from "../model/practicelog";
import Player from "../model/player";
import Sequelize from "sequelize";
import getSignedS3URL from "../lib/functions/getSignedS3URL";
import { sequelize } from "../model";
import AWS from "aws-sdk";
import Video from "../model/video";
import PracticeLog from "../model/practicelog";
import Goal from "../model/goal";

export const createPracticelog = async (req: Request, res: Response) => {
  try {
    const goal_id = req.body.goalId;
    const memo = req.body.memo;
    const time = req.body.time;
    const videoFileNameExt = req.body.videoFileNameExt;
    const videoFileName = req.body.videoFileName;
    const videoPlaybackTime = req.body.videoPlaybackTime;
    const videoFileSize = req.body.videoFileSize;

    sequelize.transaction(async (t) => {
      const practice = await PracticeLog.create(
        {
          memo,
          player_id: req.playerId,
          goal_id,
          time,
        },
        { transaction: t }
      );
      if (!practice) {
        throw new Error("Could not create practice");
      } else {
        const video = await Video.create(
          {
            file_name: videoFileName,
            file_name_ext: videoFileNameExt,
            playback_time: videoPlaybackTime,
            file_size: videoFileSize,
            practicelog_id: practice.id,
          },
          { transaction: t }
        );
        if (!video) {
          throw new Error("Could not create video");
        }
      }
    });
    res.status(StatusCodes.OK).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const getPracticelogs = async (req: Request, res: Response) => {
  try {
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
    const totalPracticelogs = await PracticeLog.count();
    const practiceLogs = await PracticeLog.findAll({
      include: [
        {
          model: Video,
          required: false,
        },
        {
          model: Goal,
          required: true,
        },
      ],
      limit,
      offset,
    });

    const thumbnailURLs = new Array<string>(practiceLogs.length);
    practiceLogs.forEach((practice, index) => {
      const key = `thumbnail/${practice.player_id}/${practice.video?.file_name}.jpg`;
      const signedUrl = getSignedS3URL({
        bucket: process.env.BUCKET!,
        key,
      });
      thumbnailURLs[index] = signedUrl;
    });

    res.status(StatusCodes.OK).json({
      practiceLogs,
      totalPages: Math.ceil(totalPracticelogs / parseInt(size as string)),
      thumbnailURLs,
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const getPracticelogById = async (req: Request, res: Response) => {
  try {
    const practicelogId = req.params.practiceId;
    const playerId = req.playerId;
    const result = await sequelize.transaction(async (t) => {
      const practicelog = await Practicelog.findOne({
        where: { id: practicelogId },
        include: [{ model: Player, required: true }],
        transaction: t,
      });
      if (!practicelog) {
        return null;
      }
      const isOwner = playerId === practicelog.player_id;
      await practicelog.update(
        { view: practicelog.view + 1 },
        { transaction: t }
      );
      // const signedUrl = getSignedS3URL({
      //   bucket: process.env.BUCKET!,
      //   key: practicelog.s3_key,
      // });
      // return { practicelog, signedUrl, isOwner };
    });
    if (result) {
      res.status(StatusCodes.OK).send(result);
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "Practicelog not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

export const updatePracticelog = async (req: Request, res: Response) => {
  try {
    const practicelogId = req.params.practiceId;
    const playerId = req.playerId;
    const { memo } = req.body;
    const result = await sequelize.transaction(async (t) => {
      const practice = await Practicelog.update(
        { memo },
        {
          where: { id: practicelogId, player_id: playerId },
          transaction: t,
        }
      );
      return practice[0] > 0;
    });
    if (result) {
      res.status(StatusCodes.OK).end();
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "Practice log not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

export const deletePracticelog = async (req: Request, res: Response) => {
  try {
    const practiceId = req.params.practiceId;
    const playerId = req.playerId;
    const result = await sequelize.transaction(async (t) => {
      const practicelog = await Practicelog.findOne({
        where: { id: practiceId, player_id: playerId },
        transaction: t,
      });
      // const s3 = new AWS.S3();
      // const bucketParams1 = {
      //   Bucket: process.env.BUCKET!,
      //   Key: practicelog?.s3_key.split(".")[0] + ".jpg",
      // };
      // const bucketParams2 = {
      //   Bucket: process.env.BUCKET!,
      //   Key: practice?.s3_key!,
      // };
      // s3.deleteObject(bucketParams1, (err, data) => {
      //   if (err) {
      //     throw err;
      //   }
      //   console.log("s3 delete thumbnail ", data);
      // });
      // s3.deleteObject(bucketParams2, (err, data) => {
      //   if (err) {
      //     throw err;
      //   }
      //   console.log("s3 delete video ", data);
      // });
      await practicelog?.destroy({ transaction: t });
      return true;
    });
    if (result) {
      res.status(StatusCodes.OK).end();
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "Practicelog not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};
