import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import Player from "./player";
import PracticeLog from "./practicelog";

export interface LikeModelAttributes extends LikeCreationAttributes {
  id: number;
  is_like: boolean;
}

interface LikeCreationAttributes {
  player: number;
  practice_log: number;
}

export default class Like extends Model<
  LikeModelAttributes,
  LikeCreationAttributes
> {
  declare id: number;
  declare player: number;
  declare practice_log: number;
  declare is_like: boolean;
}

Like.belongsTo(PracticeLog, {
  foreignKey: {
    allowNull: false,
    name: "practice_log",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Like.belongsTo(Player, {
  foreignKey: {
    allowNull: false,
    name: "player",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

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
    player: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Player,
        key: "id",
      },
      comment: "좋아요를 한 연주자",
    },
    practice_log: {
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
