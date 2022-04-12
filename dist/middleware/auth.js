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
exports.loginValidator = exports.signupValidator = exports.checkDuplicatedEmail = exports.checkDuplicatedUsername = exports.verifyAuthCode = exports.verifyRefreshToken = exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../model/user"));
const authCode_1 = __importDefault(require("../model/authCode"));
const http_status_codes_1 = require("http-status-codes");
const express_validator_1 = require("express-validator");
const verifyAccessToken = (req, res, next) => {
    // const token = req.headers["x-access-token"] as string | undefined;
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .send({ message: "Access token is not provided", expired: false });
    }
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res
                    .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                    .send({ message: "Given access token is not valid", expired: true });
            }
            else {
                return res
                    .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                    .send({ message: "Given access token is not valid", expired: false });
            }
        }
        req.userId = decoded.id;
        next();
    });
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (req, res, next) => {
    // const token = req.headers["x-refresh-token"] as string | undefined;
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .send({ message: "No token provided." });
    }
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .send({ message: "Invalid token provided" });
        }
        req.userId = decoded.id;
        req.token = bearerToken;
        next();
    });
};
exports.verifyRefreshToken = verifyRefreshToken;
const verifyAuthCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authCode = req.body.authCode;
    if (!authCode)
        return res
            .status(http_status_codes_1.StatusCodes.FORBIDDEN)
            .send({ message: "Given auth code is not valid" });
    yield authCode_1.default.findOne({ where: { user_id: req.userId } })
        .then((code) => __awaiter(void 0, void 0, void 0, function* () {
        if (code) {
            yield code.destroy({ hooks: true });
            next();
        }
        else {
            return res
                .status(http_status_codes_1.StatusCodes.FORBIDDEN)
                .send({ message: "Given auth code is not valid" });
        }
    }))
        .catch((err) => {
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: err.message });
    });
});
exports.verifyAuthCode = verifyAuthCode;
const checkDuplicatedUsername = (req, res, next) => {
    user_1.default.findOne({
        where: {
            username: req.body.username,
        },
    })
        .then((user) => {
        if (user) {
            res.status(http_status_codes_1.StatusCodes.CONFLICT).send({
                msg: "Provided username is already occupied.",
                param: "username",
                value: req.body.username,
            });
            return;
        }
        next();
    })
        .catch((err) => {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(Object.assign({}, err));
    });
};
exports.checkDuplicatedUsername = checkDuplicatedUsername;
const checkDuplicatedEmail = (req, res, next) => {
    user_1.default.findOne({
        where: {
            email: req.body.email,
        },
    })
        .then((user) => {
        if (user) {
            res.status(http_status_codes_1.StatusCodes.CONFLICT).send({
                msg: "Provided email is already occupied.",
                param: "email",
                value: req.body.email,
            });
            return;
        }
        next();
    })
        .catch((err) => {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(Object.assign({}, err));
    });
};
exports.checkDuplicatedEmail = checkDuplicatedEmail;
const signupValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, express_validator_1.body)("email", "Invalid email")
        .notEmpty()
        .withMessage("email is empty")
        .isEmail()
        .withMessage("invalid email form")
        .normalizeEmail()
        .run(req);
    yield (0, express_validator_1.body)("username", "Invalid username")
        .notEmpty()
        .withMessage("username is empty")
        .matches(/^(?=.*[a-z])[a-zA-Z0-9]{8,20}$/i)
        .withMessage("username does not meet criteria")
        .run(req);
    yield (0, express_validator_1.body)("password", "Invalid password")
        .notEmpty()
        .withMessage("password is empty")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
        .withMessage("password does not meet criteria")
        .run(req);
    const result = (0, express_validator_1.validationResult)(req);
    console.log("result: ", result);
    if (!result.isEmpty()) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors: result.array() });
    }
    next();
});
exports.signupValidator = signupValidator;
const loginValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, express_validator_1.body)("email", "Invalid email")
        .notEmpty()
        .withMessage("email is empty")
        .isEmail()
        .withMessage("invalid email form")
        .normalizeEmail()
        .run(req);
    yield (0, express_validator_1.body)("password", "Invalid password")
        .notEmpty()
        .withMessage("password is empty")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
        .withMessage("password does not meet requirements")
        .run(req);
    const result = (0, express_validator_1.validationResult)(req);
    console.log("result: ", result);
    if (!result.isEmpty()) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors: result.array() });
    }
    next();
});
exports.loginValidator = loginValidator;
//Email:  At least one letter, 8~20 letters and digists
/*
/^
  (?=.*\d)          // should contain at least one digit
  (?=.*[a-z])       // should contain at least one lower case
  (?=.*[A-Z])       // should contain at least one upper case
  [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
$/
*/
