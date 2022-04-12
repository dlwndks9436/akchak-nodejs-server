"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagingData = void 0;
const getSignedS3URL_1 = __importDefault(require("./getSignedS3URL"));
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: practices } = data;
    const currentPage = page ? +parseInt(page, 10) : 0;
    const totalPages = Math.ceil(totalItems / limit);
    const thumbnailURLs = new Array(practices.length);
    practices.forEach((practice, index) => {
        const key = practice.s3_key
            .split(".")
            .map((val) => {
            if (val === "mp4") {
                return "jpg";
            }
            return val;
        })
            .join(".");
        const signedUrl = (0, getSignedS3URL_1.default)({
            bucket: process.env.BUCKET,
            key,
        });
        thumbnailURLs[index] = signedUrl;
    });
    return { totalItems, practices, totalPages, currentPage, thumbnailURLs };
};
exports.getPagingData = getPagingData;
