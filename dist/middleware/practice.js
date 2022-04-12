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
Object.defineProperty(exports, "__esModule", { value: true });
exports.practiceUpdateValidator = exports.practiceValidator = void 0;
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
const practiceValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, express_validator_1.body)("title", "Invalid title")
        .notEmpty()
        .withMessage("email is empty")
        .isLength({ min: 5 })
        .withMessage("title must be longer than 5 characters")
        .run(req);
    yield (0, express_validator_1.body)("duration", "Invalid duration")
        .notEmpty()
        .withMessage("duration is empty")
        .isNumeric()
        .withMessage("duration is not a number")
        .run(req);
    yield (0, express_validator_1.body)("from", "Invalid directory name")
        .notEmpty()
        .withMessage("directory name is empty")
        .run(req);
    yield (0, express_validator_1.body)("s3Key", "Invalid key")
        .notEmpty()
        .withMessage("key name is empty")
        .run(req);
    yield (0, express_validator_1.body)("practiceTime", "Invalid practice time")
        .notEmpty()
        .withMessage("practice time is empty")
        .isNumeric()
        .withMessage("practice time is not a number")
        .run(req);
    const result = (0, express_validator_1.validationResult)(req);
    console.log("result: ", result);
    if (!result.isEmpty()) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors: result.array() });
    }
    next();
});
exports.practiceValidator = practiceValidator;
const practiceUpdateValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, express_validator_1.body)("title", "Invalid title")
        .notEmpty()
        .withMessage("email is empty")
        .isLength({ min: 5 })
        .withMessage("title must be longer than 5 characters")
        .run(req);
    const result = (0, express_validator_1.validationResult)(req);
    console.log("result: ", result);
    if (!result.isEmpty()) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors: result.array() });
    }
    next();
});
exports.practiceUpdateValidator = practiceUpdateValidator;
