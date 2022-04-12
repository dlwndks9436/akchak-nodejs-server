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
exports.getUser = exports.destroyUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_1 = __importDefault(require("../model/user"));
const destroyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_1.default.destroy({ where: { _id: 1 }, individualHooks: true });
    res.status(http_status_codes_1.StatusCodes.OK).send({ message: "OK" });
});
exports.destroyUser = destroyUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ where: { _id: req.userId } });
    if (user) {
        res.status(http_status_codes_1.StatusCodes.OK).send({
            id: req.userId,
            username: user.username,
            email: user.email,
            active: user.active,
            banned_until: user.banned_until,
        });
    }
    else {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).end();
    }
});
exports.getUser = getUser;
