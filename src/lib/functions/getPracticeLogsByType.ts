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
      attributes: ["id", "view", "created_at", "player_id"],
      where: {
        [Op.or]: [
          { "$goal.phrase.title$": { [Op.substring]: query } },
          { "$goal.music.title$": { [Op.substring]: query } },
        ],
        "$player.unregistered_at$": {
          [Op.is]: null,
        },
      },
      include: [
        {
          model: Video,
          required: true,
          as: "video",
          attributes: ["playback_time", "file_name"],
        },
        {
          model: Player,
          required: true,
          as: "player",
          attributes: ["username"],
        },
        {
          model: Goal,
          required: true,
          as: "goal",
          attributes: ["phrase_id", "music_id"],
          include: [
            {
              model: Phrase,
              required: false,
              as: "phrase",
              attributes: ["title", "subheading"],
              include: [
                {
                  model: Book,
                  required: true,
                  as: "book",
                  attributes: ["title"],
                },
              ],
            },
            {
              model: Music,
              required: false,
              as: "music",
              attributes: ["title", "artist"],
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
      attributes: ["id", "view", "created_at", "player_id"],
      where: {
        "$player.username$": { [Op.substring]: query },
        "$player.unregistered_at$": {
          [Op.is]: null,
        },
      },
      include: [
        {
          model: Video,
          required: true,
          as: "video",
          attributes: ["playback_time", "file_name"],
        },
        {
          model: Player,
          required: true,
          as: "player",
          attributes: ["username"],
        },
        {
          model: Goal,
          required: true,
          as: "goal",
          attributes: ["phrase_id", "music_id"],
          include: [
            {
              model: Phrase,
              required: false,
              as: "phrase",
              attributes: ["title", "subheading"],
              include: [
                {
                  model: Book,
                  required: true,
                  as: "book",
                  attributes: ["title"],
                },
              ],
            },
            {
              model: Music,
              required: false,
              as: "music",
              attributes: ["title", "artist"],
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
      attributes: ["id", "view", "created_at", "player_id"],
      where: {
        "$goal.phrase.book.title$": { [Op.substring]: query },
        "$player.unregistered_at$": {
          [Op.is]: null,
        },
      },
      include: [
        {
          model: Video,
          required: true,
          as: "video",
          attributes: ["playback_time", "file_name"],
        },
        {
          model: Player,
          required: true,
          as: "player",
          attributes: ["username"],
        },
        {
          model: Goal,
          required: true,
          as: "goal",
          attributes: ["phrase_id"],
          include: [
            {
              model: Phrase,
              required: false,
              as: "phrase",
              attributes: ["title", "subheading"],
              include: [
                {
                  model: Book,
                  required: true,
                  as: "book",
                  attributes: ["title"],
                },
              ],
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
      attributes: ["id", "view", "created_at", "player_id"],
      where: {
        "$goal.music.artist$": { [Op.substring]: query },
        "$player.unregistered_at$": {
          [Op.is]: null,
        },
      },
      include: [
        {
          model: Video,
          required: true,
          as: "video",
          attributes: ["playback_time", "file_name"],
        },
        {
          model: Player,
          required: true,
          as: "player",
          attributes: ["username"],
        },
        {
          model: Goal,
          required: true,
          as: "goal",
          attributes: ["music_id"],
          include: [
            {
              model: Music,
              required: false,
              as: "music",
              attributes: ["title", "artist"],
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
      attributes: ["id", "view", "created_at", "player_id"],
      where: {
        "$player.unregistered_at$": {
          [Op.is]: null,
        },
      },
      include: [
        {
          model: Video,
          required: true,
          as: "video",
          attributes: ["playback_time", "file_name"],
        },
        {
          model: Player,
          required: true,
          as: "player",
          attributes: ["username"],
        },
        {
          model: Goal,
          required: true,
          as: "goal",
          attributes: ["phrase_id", "music_id"],
          include: [
            {
              model: Phrase,
              required: false,
              as: "phrase",
              attributes: ["title", "subheading"],
              include: [
                {
                  model: Book,
                  required: true,
                  as: "book",
                  attributes: ["title"],
                },
              ],
            },
            {
              model: Music,
              required: false,
              as: "music",
              attributes: ["title", "artist"],
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
