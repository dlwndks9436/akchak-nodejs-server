import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from ".";
import Player from "./player";
import PracticeLog from "./practicelog";

export default class Like extends Model<
  InferAttributes<Like>,
  InferCreationAttributes<Like>
> {
  declare id: CreationOptional<number>;
  declare player_id: ForeignKey<Player["id"]>;
  declare practicelog_id: ForeignKey<PracticeLog["id"]>;
  declare is_like: CreationOptional<boolean>;

  declare player?: NonAttribute<Player>;
  declare practice_log?: NonAttribute<PracticeLog>;
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
