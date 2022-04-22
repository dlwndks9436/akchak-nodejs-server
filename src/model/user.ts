import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import AuthCode from "./verificationCode";
import Practice from "./practice";
import Rating from "./like";
import AuthToken from "./jwtToken";

/**
 * @swagger
 * components:
 *  schemas:
 *    validation-error:
 *      description: "Schema for response of invalid user's input"
 *      type: object
 *      properties:
 *        errors:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              value:
 *                type: string
 *              msg:
 *                type: string
 *              param:
 *                type: string
 *              location:
 *                type: string
 *            example:
 *              - value: "username@email"
 *                msg: "invalid email form"
 *                param: "email"
 *                location: "body"
 *              - value: ""
 *                msg: "password is empty"
 *                param: "password"
 *                location: "body"
 *              - value: ""
 *                msg: "password does not meet criteria"
 *                param: "password"
 *                location: "body"
 */

interface UserModelAttributes {
  _id: number;
  username: string;
  email: string;
  password: string;
  active: boolean;
  banned_until: Date;
}

interface UserCreationAttributes {
  username: string;
  email: string;
  password: string;
}

export default class User extends Model<
  UserModelAttributes,
  UserCreationAttributes
> {
  declare _id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare active: boolean;
  declare banned_until: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(60, true),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    banned_until: { type: DataTypes.DATE },
  },
  {
    modelName: "user",
    tableName: "users",
    initialAutoIncrement: "1",
    hooks: {
      afterCreate: async (user) => {
        const [results, metadata] = await sequelize.query(
          "CREATE EVENT clearUser" +
            user._id +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 12 HOUR DO DELETE FROM users WHERE _id = " +
            user._id
        );
        console.log("results of user delete event: ", results);
        console.log("metadata of user delete event: ", metadata);
      },
      afterDestroy: async (user) => {
        const [results, metadata] = await sequelize.query(
          "DROP EVENT IF EXISTS clearUser" + user._id
        );
        console.log("results of user delete event: ", results);
        console.log("metadata of user delete event: ", metadata);
      },
    },
    sequelize,
  }
);

User.hasOne(AuthCode, {
  foreignKey: { name: "user_id", allowNull: false },
  onDelete: "CASCADE",
  constraints: true,
});
User.hasMany(AuthToken, {
  foreignKey: { name: "user_id", allowNull: false },
  onDelete: "CASCADE",
  constraints: true,
});
User.hasMany(Practice, {
  foreignKey: { name: "user_id", allowNull: false },
  onDelete: "CASCADE",
  constraints: true,
});
User.hasMany(Rating, {
  foreignKey: { name: "user_id", allowNull: false },
  onDelete: "CASCADE",
  constraints: true,
});
Practice.hasMany(Rating, {
  foreignKey: { name: "practice_id", allowNull: false },
  onDelete: "CASCADE",
  constraints: true,
});
AuthCode.belongsTo(User, {
  foreignKey: { allowNull: false, name: "user_id" },
  onDelete: "CASCADE",
  constraints: true,
});
AuthToken.belongsTo(User, {
  foreignKey: { allowNull: false, name: "user_id" },
  onDelete: "CASCADE",
  constraints: true,
});
Practice.belongsTo(User, {
  foreignKey: { allowNull: false, name: "user_id" },
  onDelete: "CASCADE",
  constraints: true,
});
Rating.belongsTo(User, {
  foreignKey: { allowNull: false, name: "user_id" },
  onDelete: "CASCADE",
  constraints: true,
});
Rating.belongsTo(Practice, {
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
