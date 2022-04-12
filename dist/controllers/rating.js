"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countRatings = exports.changeRating = exports.getRating = void 0;
const http_status_codes_1 = require("http-status-codes");
const model_1 = require("../model");
const rating_1 = __importDefault(require("../model/rating"));
const getRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield model_1.sequelize.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            const practiceId = req.params.practiceId;
            const rating = yield rating_1.default.findOrCreate({
                where: { user_id: req.userId, practice_id: practiceId },
                transaction: t,
            });
            if (!rating) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).end();
            }
            res.status(http_status_codes_1.StatusCodes.OK).send(rating);
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});
exports.getRating = getRating;
const changeRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield model_1.sequelize.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            const practiceId = req.params.practiceId;
            const isLike = req.body.isLike;
            const rating = yield rating_1.default.update({ isLike }, {
                where: { user_id: req.userId, practice_id: practiceId },
                transaction: t,
            });
            if (!rating) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).end();
            }
            res.status(http_status_codes_1.StatusCodes.OK).send(rating);
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});
exports.changeRating = changeRating;
const countRatings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield model_1.sequelize.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            const practiceIdStr = req.query.practiceId;
            const practiceId = parseInt(practiceIdStr, 10);
            console.log("practice id: ", practiceId);
            console.log("practice id string: ", practiceIdStr);
            const count = yield rating_1.default.count({
                where: { practice_id: practiceId, isLike: true },
                transaction: t,
            });
            console.log("count: ", count);
            res.status(http_status_codes_1.StatusCodes.OK).send({ count });
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});
exports.countRatings = countRatings;
