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
const sequelize_1 = require("sequelize");
const _1 = require(".");
const user_1 = __importDefault(require("./user"));
class AuthToken extends sequelize_1.Model {
}
exports.default = AuthToken;
AuthToken.init({
    _id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: user_1.default,
            key: "_id",
        },
    },
    body: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: _1.sequelize,
    modelName: "auth_token",
    tableName: "auth_tokens",
    initialAutoIncrement: "1",
    hooks: {
        afterCreate: (token) => __awaiter(void 0, void 0, void 0, function* () {
            const [results, metadata] = yield _1.sequelize.query("CREATE EVENT clearToken" +
                token._id +
                " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 30 DAY DO DELETE FROM auth_tokens WHERE _id = " +
                token._id);
            console.log("results of user delete event: ", results);
            console.log("metadata of user delete event: ", metadata);
        }),
        afterUpdate: (token) => __awaiter(void 0, void 0, void 0, function* () {
            const [results, metadata] = yield _1.sequelize.query("ALTER EVENT clearToken" +
                token._id +
                " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 30 DAY DO DELETE FROM auth_tokens WHERE _id = " +
                token._id);
            console.log("results of user delete event: ", results);
            console.log("metadata of user delete event: ", metadata);
        }),
        beforeDestroy: (token) => __awaiter(void 0, void 0, void 0, function* () {
            const [results, metadata] = yield _1.sequelize.query("DROP EVENT IF EXISTS clearToken" + token._id);
            console.log("results of user delete event: ", results);
            console.log("metadata of user delete event: ", metadata);
        }),
    },
});
