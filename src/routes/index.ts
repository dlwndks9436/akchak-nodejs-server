import { Router } from "express";
import { playerRouter } from "./player";
import { practicelogRouter } from "./practicelog";
import { likeRouter } from "./like";
import { bookRouter } from "./book";
import { phraseRouter } from "./phrase";
import { goalRouter } from "./goal";
import { musicRouter } from "./music";

const router = Router();

/* ROUTE */
router.use("/player", playerRouter);
router.use("/practicelog", practicelogRouter);
router.use("/like", likeRouter);
router.use("/book", bookRouter);
router.use("/phrase", phraseRouter);
router.use("/music", musicRouter);
router.use("/goal", goalRouter);

export default router;
