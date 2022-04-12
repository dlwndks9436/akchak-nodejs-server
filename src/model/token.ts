import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import User from "./user";

/**
 * @swagger
 * components:
 *  schemas:
 *    tokens:
 *      description: "Schema for access token and refresh token"
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ1MTk2MDYzLCJleHAiOjE2NDUxOTYxODN9.mXVh6rh-k54fB_KiD-4n-7vpzALWLAgB3d91CqwjBtk"
 *        refresToken:
 *          type: string
 *          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ1NDI1NzgzLCJleHAiOjE2NDgwMTc3ODN9.SRxcjv0nWht25qDuzxPkn1OvnUQkJfG-v8VbOs5OpM4"
 */

interface AuthTokenModelAttributes {
  _id: number;
  user_id: number;
  body: string;
}

interface AuthTokenCreationAttributes {
  user_id: number;
  body: string;
}

export default class AuthToken extends Model<
  AuthTokenModelAttributes,
  AuthTokenCreationAttributes
> {
  declare _id: number;
  declare user_id: number;
  declare body: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

AuthToken.init(
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "_id",
      },
    },
    body: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "auth_token",
    tableName: "auth_tokens",
    initialAutoIncrement: "1",
    hooks: {
      afterCreate: async (token) => {
        const [results, metadata] = await sequelize.query(
          "CREATE EVENT clearToken" +
            token._id +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 30 DAY DO DELETE FROM auth_tokens WHERE _id = " +
            token._id
        );
        console.log("results of user delete event: ", results);
        console.log("metadata of user delete event: ", metadata);
      },
      afterUpdate: async (token) => {
        const [results, metadata] = await sequelize.query(
          "ALTER EVENT clearToken" +
            token._id +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 30 DAY DO DELETE FROM auth_tokens WHERE _id = " +
            token._id
        );
        console.log("results of user delete event: ", results);
        console.log("metadata of user delete event: ", metadata);
      },
      beforeDestroy: async (token) => {
        const [results, metadata] = await sequelize.query(
          "DROP EVENT IF EXISTS clearToken" + token._id
        );
        console.log("results of user delete event: ", results);
        console.log("metadata of user delete event: ", metadata);
      },
    },
  }
);
