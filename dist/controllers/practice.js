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
exports.deletePractice = exports.updatePractice = exports.getPracticeById = exports.getPractices = exports.createPractice = void 0;
const http_status_codes_1 = require("http-status-codes");
const getPagination_1 = require("../lib/functions/getPagination");
const getPagingData_1 = require("../lib/functions/getPagingData");
const practice_1 = __importDefault(require("../model/practice"));
const user_1 = __importDefault(require("../model/user"));
const sequelize_1 = __importDefault(require("sequelize"));
const getSignedS3URL_1 = __importDefault(require("../lib/functions/getSignedS3URL"));
const model_1 = require("../model");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const createPractice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fromDirectory = req.body.from;
        const title = req.body.title;
        const description = req.body.description;
        const duration = req.body.duration;
        const practiceTime = req.body.practiceTime;
        const s3Key = req.body.s3Key;
        yield practice_1.default.create({
            user_id: req.userId,
            title,
            description,
            duration,
            from_directory: fromDirectory,
            practice_time: practiceTime,
            s3_key: s3Key,
        });
        res.status(http_status_codes_1.StatusCodes.OK).end();
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});
exports.createPractice = createPractice;
const getPractices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, size, title, username } = req.query;
    const condition = title || username ? {} : undefined;
    if (title) {
        condition.title = { [sequelize_1.default.Op.like]: `%${title}%` };
    }
    if (username) {
        condition.username = { [sequelize_1.default.Op.like]: `%${username}%` };
    }
    const { limit, offset } = (0, getPagination_1.getPagination)(page, size);
    practice_1.default.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        include: [{ model: user_1.default, required: true, attributes: ["username"] }],
    })
        .then((data) => {
        console.log("find all practice result: ", data);
        const response = (0, getPagingData_1.getPagingData)(data, page, limit);
        res.status(http_status_codes_1.StatusCodes.OK).send(response);
    })
        .catch((err) => {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: err.message || "Some error occurred while retrieving tutorials.",
        });
    });
});
exports.getPractices = getPractices;
const getPracticeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const practiceId = req.params.practiceId;
        const userId = req.userId;
        const result = yield model_1.sequelize.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            const practice = yield practice_1.default.findOne({
                where: { _id: practiceId },
                include: [{ model: user_1.default, required: true }],
                transaction: t,
            });
            if (!practice) {
                return null;
            }
            const isOwner = userId === practice.user_id;
            yield practice.update({ views: practice.views + 1 }, { transaction: t });
            const signedUrl = (0, getSignedS3URL_1.default)({
                bucket: process.env.BUCKET,
                key: practice.s3_key,
            });
            return { practice, signedUrl, isOwner };
        }));
        if (result) {
            res.status(http_status_codes_1.StatusCodes.OK).send(result);
        }
        else {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ message: "Practice not found" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
});
exports.getPracticeById = getPracticeById;
const updatePractice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const practiceId = req.params.practiceId;
        const userId = req.userId;
        const { title, description } = req.body;
        const result = yield model_1.sequelize.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            const practice = yield practice_1.default.update({ title, description }, {
                where: { _id: practiceId, user_id: userId },
                transaction: t,
            });
            return practice[0] > 0;
        }));
        if (result) {
            res.status(http_status_codes_1.StatusCodes.OK).end();
        }
        else {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ message: "Practice not found" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
});
exports.updatePractice = updatePractice;
const deletePractice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const practiceId = req.params.practiceId;
        const userId = req.userId;
        const result = yield model_1.sequelize.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            const practice = yield practice_1.default.findOne({
                where: { _id: practiceId, user_id: userId },
                transaction: t,
            });
            const s3 = new aws_sdk_1.default.S3();
            const bucketParams1 = {
                Bucket: process.env.BUCKET,
                Key: (practice === null || practice === void 0 ? void 0 : practice.s3_key.split(".")[0]) + ".jpg",
            };
            const bucketParams2 = {
                Bucket: process.env.BUCKET,
                Key: practice === null || practice === void 0 ? void 0 : practice.s3_key,
            };
            s3.deleteObject(bucketParams1, (err, data) => {
                if (err) {
                    throw err;
                }
                console.log("s3 delete thumbnail ", data);
            });
            s3.deleteObject(bucketParams2, (err, data) => {
                if (err) {
                    throw err;
                }
                console.log("s3 delete video ", data);
            });
            yield (practice === null || practice === void 0 ? void 0 : practice.destroy({ transaction: t }));
            return true;
        }));
        if (result) {
            res.status(http_status_codes_1.StatusCodes.OK).end();
        }
        else {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ message: "Practice not found" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
});
exports.deletePractice = deletePractice;
