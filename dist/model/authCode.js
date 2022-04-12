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
class AuthCode extends sequelize_1.Model {
}
exports.default = AuthCode;
AuthCode.init({
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
    code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    modelName: "auth_code",
    tableName: "auth_codes",
    initialAutoIncrement: "1",
    hooks: {
        afterCreate: (code) => __awaiter(void 0, void 0, void 0, function* () {
            const [results, metadata] = yield _1.sequelize.query("CREATE EVENT clearCode" +
                code._id +
                " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 5 MINUTE DO DELETE FROM auth_codes WHERE _id = " +
                code._id);
            console.log("results of user delete event: ", results);
            console.log("metadata of user delete event: ", metadata);
        }),
        afterUpdate: (code) => __awaiter(void 0, void 0, void 0, function* () {
            const [results, metadata] = yield _1.sequelize.query("ALTER EVENT clearCode" +
                code._id +
                " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 5 MINUTE DO DELETE FROM auth_codes WHERE _id = " +
                code._id);
            console.log("results of user delete event: ", results);
            console.log("metadata of user delete event: ", metadata);
        }),
        beforeDestroy: (code) => __awaiter(void 0, void 0, void 0, function* () {
            const [results, metadata] = yield _1.sequelize.query("DROP EVENT IF EXISTS clearCode" + code._id);
            console.log("results of user delete event: ", results);
            console.log("metadata of user delete event: ", metadata);
        }),
    },
    sequelize: _1.sequelize,
});
