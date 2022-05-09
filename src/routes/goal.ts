import { Router } from "express";
import { addGoal, getGoals } from "../controllers/goal";
import { verifyAccessToken } from "../middleware";

export const goalRouter = Router();

goalRouter.post("/", verifyAccessToken, addGoal);

goalRouter.get("/", verifyAccessToken, getGoals);
