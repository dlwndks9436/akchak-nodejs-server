import { Router } from "express";
import { authRouter } from "./auth";
import { practiceRouter } from "./practice";
import { userRouter } from "./user";
import { ratingRouter } from "./rating";

const router = Router();

/* ROUTE */
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/practice", practiceRouter);
router.use("/rating", ratingRouter);

export default router;
