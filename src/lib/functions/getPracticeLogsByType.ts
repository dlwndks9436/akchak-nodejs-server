import { Op } from "sequelize";
import Book from "../../model/book";
import Goal from "../../model/goal";
import Music from "../../model/music";
import Phrase from "../../model/phrase";
import Player from "../../model/player";
import Video from "../../model/video";
import PracticeLog from "../../model/practicelog";

export const getPracticeLogsByType = async (
  type: string,
  query: string,
  limit: number,
  offset: number
): Promise<PracticeLog[]> => {
  let practicelogs;
  if (type === "제목") {
    practicelogs = await PracticeLog.findAll({
      where: {
        [Op.or]: [
          { "$goal.phrase.title$": { [Op.substring]: query } },
          { "$goal.music.title$": { [Op.substring]: query } },
        ],
      },
      include: [
        {
          model: Video,
          required: true,
          as: "video",
        },
        {
          model: Player,
          required: true,
          as: "player",
        },
        {
          model: Goal,
          required: true,
          as: "goal",
          include: [
            {
              model: Phrase,
              required: false,
              as: "phrase",
              include: [
                {
                  model: Book,
                  required: true,
                  as: "book",
                },
              ],
            },
            {
              model: Music,
              required: false,
              as: "music",
            },
          ],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });
  } else if (type === "닉네임") {
    practicelogs = await PracticeLog.findAll({
      where: {
        "$player.username$": { [Op.substring]: query },
      },
      include: [
        {
          model: Video,
          required: true,
          as: "video",
        },
        {
          model: Player,
          required: true,
          as: "player",
        },
        {
          model: Goal,
          required: true,
          as: "goal",
          include: [
            {
              model: Phrase,
              required: false,
              as: "phrase",
              include: [
                {
                  model: Book,
                  required: true,
                  as: "book",
                },
              ],
            },
            {
              model: Music,
              required: false,
              as: "music",
            },
          ],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });
  } else if (type === "책") {
    practicelogs = await PracticeLog.findAll({
      where: {
        "$goal.phrase.book.title$": { [Op.substring]: query },
      },
      include: [
        {
          model: Video,
          required: true,
          as: "video",
        },
        {
          model: Player,
          required: true,
          as: "player",
        },
        {
          model: Goal,
          required: true,
          as: "goal",
          include: [
            {
              model: Phrase,
              required: false,
              as: "phrase",
              include: [
                {
                  model: Book,
                  required: true,
                  as: "book",
                },
              ],
            },
            {
              model: Music,
              required: false,
              as: "music",
            },
          ],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });
  } else if (type === "아티스트") {
    practicelogs = await PracticeLog.findAll({
      where: {
        "$goal.music.artist$": { [Op.substring]: query },
      },
      include: [
        {
          model: Video,
          required: true,
          as: "video",
        },
        {
          model: Player,
          required: true,
          as: "player",
        },
        {
          model: Goal,
          required: true,
          as: "goal",
          include: [
            {
              model: Phrase,
              required: false,
              as: "phrase",
              include: [
                {
                  model: Book,
                  required: true,
                  as: "book",
                },
              ],
            },
            {
              model: Music,
              required: false,
              as: "music",
            },
          ],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });
  } else {
    practicelogs = await PracticeLog.findAll({
      include: [
        {
          model: Video,
          required: true,
          as: "video",
        },
        {
          model: Player,
          required: true,
          as: "player",
        },
        {
          model: Goal,
          required: true,
          as: "goal",
          include: [
            {
              model: Phrase,
              required: false,
              as: "phrase",
              include: [
                {
                  model: Book,
                  required: true,
                  as: "book",
                },
              ],
            },
            {
              model: Music,
              required: false,
              as: "music",
            },
          ],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });
  }
  return practicelogs;
};
