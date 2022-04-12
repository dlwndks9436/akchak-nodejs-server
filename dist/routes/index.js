"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./auth");
const practice_1 = require("./practice");
const user_1 = require("./user");
const rating_1 = require("./rating");
const router = (0, express_1.Router)();
/* ROUTE */
router.use("/auth", auth_1.authRouter);
router.use("/user", user_1.userRouter);
router.use("/practice", practice_1.practiceRouter);
router.use("/rating", rating_1.ratingRouter);
exports.default = router;
