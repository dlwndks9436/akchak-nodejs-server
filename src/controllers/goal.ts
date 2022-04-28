import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Goal from "../model/goal";

export const addGoal = async (req: Request, res: Response) => {
  try {
    const { phraseId, musicId } = req.body;
    const playerId = req.playerId;
    if (!phraseId && !musicId) {
      res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      const [phrase, created] = await Goal.findOrCreate({
        where: {
          player_id: playerId,
          phrase_id: phraseId || null,
          music_id: musicId || null,
        },
      });
      if (!created) {
        res.status(StatusCodes.CONFLICT).end();
      } else {
        res.status(StatusCodes.OK).end();
      }
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};
