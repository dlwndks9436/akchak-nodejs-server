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
const authCode_1 = __importDefault(require("./authCode"));
const practice_1 = __importDefault(require("./practice"));
const rating_1 = __importDefault(require("./rating"));
const token_1 = __importDefault(require("./token"));
class User extends sequelize_1.Model {
}
exports.default = User;
User.init({
    _id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(60, true),
        allowNull: false,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    banned_until: { type: sequelize_1.DataTypes.DATE },
}, {
    modelName: "user",
    tableName: "users",
    initialAutoIncrement: "1",
    hooks: {
        afterCreate: (user) => __awaiter(void 0, void 0, void 0, function* () {
            const [results, metadata] = yield _1.sequelize.query("CREATE EVENT clearUser" +
                user._id +
                " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 12 HOUR DO DELETE FROM users WHERE _id = " +
                user._id);
            console.log("results of user delete event: ", results);
            console.log("metadata of user delete event: ", metadata);
        }),
        afterDestroy: (user) => __awaiter(void 0, void 0, void 0, function* () {
            const [results, metadata] = yield _1.sequelize.query("DROP EVENT IF EXISTS clearUser" + user._id);
            console.log("results of user delete event: ", results);
            console.log("metadata of user delete event: ", metadata);
        }),
    },
    sequelize: _1.sequelize,
});
User.hasOne(authCode_1.default, {
    foreignKey: { name: "user_id", allowNull: false },
    onDelete: "CASCADE",
    constraints: true,
});
User.hasMany(token_1.default, {
    foreignKey: { name: "user_id", allowNull: false },
    onDelete: "CASCADE",
    constraints: true,
});
User.hasMany(practice_1.default, {
    foreignKey: { name: "user_id", allowNull: false },
    onDelete: "CASCADE",
    constraints: true,
});
User.hasMany(rating_1.default, {
    foreignKey: { name: "user_id", allowNull: false },
    onDelete: "CASCADE",
    constraints: true,
});
practice_1.default.hasMany(rating_1.default, {
    foreignKey: { name: "practice_id", allowNull: false },
    onDelete: "CASCADE",
    constraints: true,
});
authCode_1.default.belongsTo(User, {
    foreignKey: { allowNull: false, name: "user_id" },
    onDelete: "CASCADE",
    constraints: true,
});
token_1.default.belongsTo(User, {
    foreignKey: { allowNull: false, name: "user_id" },
    onDelete: "CASCADE",
    constraints: true,
});
practice_1.default.belongsTo(User, {
    foreignKey: { allowNull: false, name: "user_id" },
    onDelete: "CASCADE",
    constraints: true,
});
rating_1.default.belongsTo(User, {
    foreignKey: { allowNull: false, name: "user_id" },
    onDelete: "CASCADE",
    constraints: true,
});
rating_1.default.belongsTo(practice_1.default, {
    foreignKey: { allowNull: false, name: "practice_id" },
    onDelete: "CASCADE",
    constraints: true,
});
// const Users = sequelize.define("user", {
//   _id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   username: {
//     type: DataTypes.STRING(20),
//     allowNull: false,
//     unique: true,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: DataTypes.STRING(60, true),
//     allowNull: false,
//   },
//   confirmed: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false,
//   },
// });
