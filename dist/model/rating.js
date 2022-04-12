"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require(".");
const user_1 = __importDefault(require("./user"));
const practice_1 = __importDefault(require("./practice"));
class Rating extends sequelize_1.Model {
}
exports.default = Rating;
Rating.init({
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
    practice_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: practice_1.default,
            key: "_id",
        },
    },
    isLike: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: _1.sequelize,
    modelName: "rating",
    tableName: "ratings",
    initialAutoIncrement: "1",
});
