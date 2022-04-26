import { Router } from "express";
import { playerRouter } from "./player";
import { practicelogRouter } from "./practicelog";
import { likeRouter } from "./like";
import { bookRouter } from "./book";

const router = Router();

/* ROUTE */
router.use("/player", playerRouter);
router.use("/practicelog", practicelogRouter);
router.use("/like", likeRouter);
router.use("/book", bookRouter);

export default router;
