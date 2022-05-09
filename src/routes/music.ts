import { Router } from "express";
import { addMusic, getMusics } from "../controllers/music";
import {
  verifyAccessToken,
  musicInputValidator,
  musicSearchInputValidator,
} from "../middleware";

export const musicRouter = Router();

musicRouter.post("/", verifyAccessToken, musicInputValidator, addMusic);

musicRouter.get("/", verifyAccessToken, musicSearchInputValidator, getMusics);
