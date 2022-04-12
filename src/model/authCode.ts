import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import User from "./user";

interface AuthCodeModelAttributes {
  _id: number;
  user_id: number;
  code: string;
}

interface AuthCodeCreationAttributes {
  user_id: number;
  code: string;
}

export default class AuthCode extends Model<
  AuthCodeModelAttributes,
  AuthCodeCreationAttributes
> {
  declare _id: number;
  declare user_id: number;
  declare code: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

AuthCode.init(
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "auth_code",
    tableName: "auth_codes",
    initialAutoIncrement: "1",
    hooks: {
      afterCreate: async (code) => {
        const [results, metadata] = await sequelize.query(
          "CREATE EVENT clearCode" +
            code._id +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 5 MINUTE DO DELETE FROM auth_codes WHERE _id = " +
            code._id
        );
        console.log("results of user delete event: ", results);
        console.log("metadata of user delete event: ", metadata);
      },
      afterUpdate: async (code) => {
        const [results, metadata] = await sequelize.query(
          "ALTER EVENT clearCode" +
            code._id +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 5 MINUTE DO DELETE FROM auth_codes WHERE _id = " +
            code._id
        );
        console.log("results of user delete event: ", results);
        console.log("metadata of user delete event: ", metadata);
      },
      beforeDestroy: async (code) => {
        const [results, metadata] = await sequelize.query(
          "DROP EVENT IF EXISTS clearCode" + code._id
        );
        console.log("results of user delete event: ", results);
        console.log("metadata of user delete event: ", metadata);
      },
    },
    sequelize,
  }
);
