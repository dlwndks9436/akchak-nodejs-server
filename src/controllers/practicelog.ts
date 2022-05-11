import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getPagination } from "../lib/functions/getPagination";
import Practicelog from "../model/practicelog";
import Player from "../model/player";
import getSignedS3URL from "../lib/functions/getSignedS3URL";
import { sequelize } from "../model";
import Video from "../model/video";
import PracticeLog from "../model/practicelog";
import Goal from "../model/goal";
import Phrase from "../model/phrase";
import Book from "../model/book";
import Music from "../model/music";
import AWS from "aws-sdk";
import { getPracticeLogsByType } from "../lib/functions/getPracticeLogsByType";
import { Op } from "sequelize";
import { sub, differenceInDays } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

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
    const { page, size, type } = req.query;
    const query = req.query.query || "";
    const { limit, offset } = getPagination(page as string, size as string);
    const totalPracticelogs = await PracticeLog.count();
    const practiceLogs = await getPracticeLogsByType(
      type as string,
      query as string,
      limit,
      offset
    );
    console.log(practiceLogs.length);

    const results = new Array(practiceLogs.length);
    practiceLogs.forEach((practice, index) => {
      const key = `thumbnail/${practice.player_id}/${practice.video?.file_name}.jpg`;
      console.log(`thumbnail key: ${key}`);

      const signedUrl = getSignedS3URL({
        bucket: process.env.BUCKET!,
        key,
      });
      let item;
      if (practice.goal?.phrase) {
        item = {
          id: practice.id,
          playerName: practice.player?.username,
          phraseTitle: practice.goal?.phrase?.title,
          phraseSubheading: practice.goal?.phrase?.subheading,
          bookTitle: practice.goal?.phrase?.book?.title,
          view: practice.view,
          playbackTime: practice.video?.playback_time,
          thumbnailUrl: signedUrl,
          createdAt: practice.created_at,
        };
      } else {
        item = {
          id: practice.id,
          playerName: practice.player?.username,
          musicTitle: practice.goal?.music?.title,
          musicArtist: practice.goal?.music?.artist,
          view: practice.view,
          playbackTime: practice.video?.playback_time,
          thumbnailUrl: signedUrl,
          createdAt: practice.created_at,
        };
      }
      results[index] = item;
    });

    res.status(StatusCodes.OK).json({
      results,
      totalPages: Math.ceil(totalPracticelogs / parseInt(size as string)),
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
      const practiceLog = await Practicelog.findOne({
        where: { id: practicelogId },
        include: [
          {
            model: Video,
            required: true,
          },
          {
            model: Player,
            required: true,
          },
          {
            model: Goal,
            required: true,
            include: [
              {
                model: Phrase,
                required: false,
                include: [
                  {
                    model: Book,
                    required: true,
                  },
                ],
              },
              {
                model: Music,
                required: false,
              },
            ],
          },
        ],
        transaction: t,
      });
      if (!practiceLog) {
        return null;
      }
      const isOwner = playerId === practiceLog.player_id;
      if (!isOwner) {
        await practiceLog.update(
          { view: practiceLog.view + 1 },
          { transaction: t }
        );
      }
      const key = `video/${practiceLog.player_id}/${practiceLog.video?.file_name_ext}`;
      const videoUrl = getSignedS3URL({
        bucket: process.env.BUCKET!,
        key,
      });
      let item;
      if (practiceLog.goal?.phrase) {
        item = {
          id: practiceLog.id,
          playerName: practiceLog.player?.username,
          phraseTitle: practiceLog.goal?.phrase?.title,
          phraseSubheading: practiceLog.goal?.phrase?.subheading,
          bookTitle: practiceLog.goal?.phrase?.book?.title,
          view: practiceLog.view,
          playbackTime: practiceLog.video?.playback_time,
          createdAt: practiceLog.created_at,
          memo: practiceLog.memo,
          videoUrl,
          isOwner,
        };
      } else {
        item = {
          id: practiceLog.id,
          playerName: practiceLog.player?.username,
          musicTitle: practiceLog.goal?.music?.title,
          musicArtist: practiceLog.goal?.music?.artist,
          view: practiceLog.view,
          playbackTime: practiceLog.video?.playback_time,
          createdAt: practiceLog.created_at,
          memo: practiceLog.memo,
          videoUrl,
          isOwner,
        };
      }
      return item;
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

export const deletePracticelog = async (req: Request, res: Response) => {
  try {
    const practiceId = req.params.practiceId;
    const playerId = req.playerId;
    const result = await sequelize.transaction(async (t) => {
      const practicelog = await Practicelog.findOne({
        where: { id: practiceId, player_id: playerId },
        include: [{ model: Video, required: true }],
        transaction: t,
      });
      if (practicelog) {
        const mediaName = practicelog?.video?.file_name;
        const s3 = new AWS.S3();
        const bucketParams1 = {
          Bucket: process.env.BUCKET!,
          Key: `thumbnail/${playerId}/${mediaName}.jpg`,
        };
        const bucketParams2 = {
          Bucket: process.env.BUCKET!,
          Key: `video/${playerId}/${mediaName}.mp4`,
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
        await practicelog?.destroy({ transaction: t });
        return true;
      } else {
        return false;
      }
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

export const getRecentPracticeTime = async (req: Request, res: Response) => {
  try {
    const playerId = req.playerId;
    const timezone = req.query.timezone;
    const now = utcToZonedTime(new Date(), timezone as string);
    const result = new Array<number>(7).fill(0);
    const practicelogs = await PracticeLog.findAll({
      where: {
        created_at: {
          [Op.gte]: sub(new Date(), { days: 7 }),
        },
        player_id: playerId,
      },
      raw: true,
      attributes: ["created_at", "time"],
    });
    console.log(practicelogs);

    practicelogs.forEach((practicelog) => {
      const localDate = utcToZonedTime(
        practicelog.created_at,
        timezone as string
      );
      const difference = differenceInDays(now, localDate);
      result[result.length - 1 - difference] += practicelog.time;
    });
    console.log(result);

    res.status(StatusCodes.OK).send(result);
  } catch (err) {
    console.log(err);
  }
};
