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
exports.reissueAccessToken = exports.activateUser = exports.issueAuthCode = exports.logout = exports.login = exports.signup = void 0;
const user_1 = __importDefault(require("../model/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = __importDefault(require("../model/token"));
const authCode_1 = __importDefault(require("../model/authCode"));
const makeAuthCode_1 = __importDefault(require("../lib/functions/makeAuthCode"));
const mailer_1 = require("./mailer");
const http_status_codes_1 = require("http-status-codes");
const model_1 = require("../model");
// TODO: add token logic in signup
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    yield user_1.default.create({
        username,
        email,
        password: bcryptjs_1.default.hashSync(password),
    })
        .then(() => {
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .send({ message: "User registration complete." });
    })
        .catch((err) => res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(Object.assign({}, err)));
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_1.default.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .send({ message: "The given email does not belong to any user" });
        }
        const passwordIsValid = bcryptjs_1.default.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({
                message: "The given password does not match",
            });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.EXPIRATION_OF_ACCESS_TOKEN,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.EXPIRATION_OF_REFRESH_TOKEN,
        });
        const authToken = yield token_1.default.create({
            user_id: user._id,
            body: refreshToken,
        });
        if (authToken) {
            res.status(http_status_codes_1.StatusCodes.OK).send({
                accessToken,
                refreshToken,
                id: user._id,
                username: user.username,
                email: user.email,
                active: user.active,
                banned_until: user.banned_until,
            });
        }
    }
    catch (err) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: err,
        });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield token_1.default.destroy({
        where: { user_id: req.userId, body: req.token },
        individualHooks: true,
        hooks: true,
    })
        .then((deletedRecord) => {
        if (deletedRecord) {
            res.status(http_status_codes_1.StatusCodes.OK).end();
        }
        else {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).end();
        }
    })
        .catch(() => {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).end();
    });
});
exports.logout = logout;
const issueAuthCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ where: { _id: req.userId } });
        if (user) {
            const result = yield authCodeToEmail(user._id, user.email);
            if (result) {
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .send({ message: "Auth code sent to user's email" });
            }
            else {
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .send({ message: "Error occured during email sending process" });
            }
        }
        else {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ message: "Invalid access." });
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err });
    }
});
exports.issueAuthCode = issueAuthCode;
const activateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield model_1.sequelize
        .query("DROP EVENT IF EXISTS clearUser" + req.userId)
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_1.default.update({ active: true }, { where: { _id: req.userId } });
        if (user) {
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .send({ message: "User email successfully authenticated" });
        }
    }))
        .catch((err) => {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    });
});
exports.activateUser = activateUser;
const reissueAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield token_1.default.findOne({
        where: { body: req.token, user_id: req.userId },
    });
    if (!token) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send("Invalid access.");
    }
    else {
        const accessToken = jsonwebtoken_1.default.sign({ id: req.userId }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.EXPIRATION_OF_ACCESS_TOKEN,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: req.userId }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.EXPIRATION_OF_REFRESH_TOKEN,
        });
        token.body = refreshToken;
        const updatedToken = yield token.save();
        if (!updatedToken) {
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send({ message: "Issue occured while updating token" });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).send({
                accessToken,
                refreshToken,
            });
        }
    }
});
exports.reissueAccessToken = reissueAccessToken;
const authCodeToEmail = (userId, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const authCode = (0, makeAuthCode_1.default)(6);
    try {
        const previousAuthCode = yield authCode_1.default.findOne({
            where: { user_id: userId },
        });
        if (previousAuthCode) {
            yield previousAuthCode.update({ code: authCode }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, mailer_1.sendMail)(userEmail, authCode);
            }));
        }
        else {
            yield authCode_1.default.create({
                user_id: userId,
                code: authCode,
            }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, mailer_1.sendMail)(userEmail, authCode);
            }));
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
    return true;
});
