import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import User from "./user";

export interface PracticeModelAttributes {
  _id: number;
  user_id: number;
  title: string;
  description: string;
  duration: number;
  from_directory: string;
  practice_time: number;
  s3_key: string;
  views: number;
}

interface PracticeCreationAttributes {
  user_id: number;
  title: string;
  description: string;
  duration: number;
  from_directory: string;
  practice_time: number;
  s3_key: string;
}

export default class Practice extends Model<
  PracticeModelAttributes,
  PracticeCreationAttributes
> {
  declare _id: number;
  declare user_id: number;
  declare title: string;
  declare description: string;
  declare duration: number;
  declare practice_time: number;
  declare from_directory: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare s3_key: string;
  declare views: number;
}

Practice.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    practice_time: { type: DataTypes.INTEGER, allowNull: false },
    s3_key: { type: DataTypes.STRING, allowNull: false },
    from_directory: { type: DataTypes.STRING, allowNull: false },
    views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: "practice",
    tableName: "practices",
    initialAutoIncrement: "1",
  }
);
