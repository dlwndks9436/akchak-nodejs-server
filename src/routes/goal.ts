import { Router } from "express";
import { addGoal } from "../controllers/goal";
import { verifyAccessToken } from "../middleware";

export const goalRouter = Router();

goalRouter.post("/", verifyAccessToken, addGoal);
