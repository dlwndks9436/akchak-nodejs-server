import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import Player from "./player";
import PracticeLog from "./practicelog";

export interface LikeModelAttributes extends LikeCreationAttributes {
  id: number;
  is_like: boolean;
}

interface LikeCreationAttributes {
  player_id: number;
  practice_log_id: number;
}

export default class Like extends Model<
  LikeModelAttributes,
  LikeCreationAttributes
> {
  declare id: number;
  declare player_id: number;
  declare practice_log_id: number;
  declare is_like: boolean;
}

Like.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
      comment: "좋아요의 고유번호",
    },
    player_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Player,
        key: "id",
      },
      comment: "좋아요를 한 연주자",
    },
    practice_log_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: PracticeLog,
        key: "id",
      },
      comment: "좋아요를 받은 연습기록",
    },
    is_like: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: "좋아요 여부",
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "like",
    initialAutoIncrement: "1",
  }
);
