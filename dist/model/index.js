"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
console.log(database_1.default.DB);
exports.sequelize = new sequelize_1.Sequelize(database_1.default.DB, database_1.default.USER, database_1.default.PASSWORD, {
    host: database_1.default.HOST,
    dialect: database_1.default.dialect,
    pool: database_1.default.pool,
});
