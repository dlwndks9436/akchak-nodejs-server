"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require(".");
const user_1 = __importDefault(require("./user"));
class Practice extends sequelize_1.Model {
}
exports.default = Practice;
Practice.init({
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
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    practice_time: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    s3_key: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    from_directory: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    views: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, {
    sequelize: _1.sequelize,
    modelName: "practice",
    tableName: "practices",
    initialAutoIncrement: "1",
});
