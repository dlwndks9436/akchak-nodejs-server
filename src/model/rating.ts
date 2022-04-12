import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import User from "./user";
import Practice from "./practice";

export interface RatingModelAttributes {
  _id: number;
  user_id: number;
  practice_id: number;
  isLike: boolean;
}

interface RatingCreationAttributes {
  user_id: number;
  practice_id: number;
}

export default class Rating extends Model<
  RatingModelAttributes,
  RatingCreationAttributes
> {
  declare _id: number;
  declare user_id: number;
  declare practice_id: number;
  declare isLike: boolean;
}

Rating.init(
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
    practice_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Practice,
        key: "_id",
      },
    },
    isLike: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "rating",
    tableName: "ratings",
    initialAutoIncrement: "1",
  }
);
