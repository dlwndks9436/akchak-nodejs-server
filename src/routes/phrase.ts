import { Router } from "express";
import { addPhrase, getPhrases } from "../controllers/phrase";
import {
  phraseAddInputValidator,
  phraseSearchInputValidator,
  verifyAccessToken,
} from "../middleware";

export const phraseRouter = Router();

phraseRouter.post("/", verifyAccessToken, phraseAddInputValidator, addPhrase);

phraseRouter.get(
  "/",
  verifyAccessToken,
  phraseSearchInputValidator,
  getPhrases
);
