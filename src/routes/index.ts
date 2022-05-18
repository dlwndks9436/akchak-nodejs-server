import { Router } from "express";
import { playerRouter } from "./player";
import { practicelogRouter } from "./practicelog";
import { likeRouter } from "./like";
import { bookRouter } from "./book";
import { phraseRouter } from "./phrase";
import { goalRouter } from "./goal";
import { musicRouter } from "./music";
import { StatusCodes } from "http-status-codes";
import { verificationCodeRouter } from "./verificationCode";
import { jwtTokenRouter } from "./jwtToken";

const router = Router();

router.get("/", (_, res) => {
  res.status(StatusCodes.OK).send("악착 api에 오신 것을 환영합니다!");
});

/* ROUTE */
router.use("/player", playerRouter);
router.use("/practicelog", practicelogRouter);
router.use("/like", likeRouter);
router.use("/book", bookRouter);
router.use("/phrase", phraseRouter);
router.use("/music", musicRouter);
router.use("/goal", goalRouter);
router.use("/verification-code", verificationCodeRouter);
router.use("/token", jwtTokenRouter);

export default router;
