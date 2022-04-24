import { Router } from "express";
import { playerRouter } from "./player";
import { practicelogRouter } from "./practicelog";
import { likeRouter } from "./like";

const router = Router();

/* ROUTE */
router.use("/player", playerRouter);
router.use("/practicelog", practicelogRouter);
router.use("/like", likeRouter);

export default router;
