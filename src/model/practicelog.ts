import {
  Association,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from ".";
import Goal from "./goal";
import Like from "./like";
import Player from "./player";
import Video from "./video";

export default class PracticeLog extends Model<
  InferAttributes<PracticeLog>,
  InferCreationAttributes<PracticeLog>
> {
  declare id: CreationOptional<number>;
  declare goal_id: ForeignKey<Goal["id"]>;
  declare player_id: ForeignKey<Player["id"]>;
  declare memo: CreationOptional<string>;
  declare time: number;
  declare view: CreationOptional<number>;
  declare started_at: Date;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare likes?: NonAttribute<Like[]>;
  declare video?: NonAttribute<Video>;
  declare player?: NonAttribute<Player>;
  declare goal?: NonAttribute<Goal>;

  declare static associations: {
    likes: Association<PracticeLog, Like>;
    video: Association<PracticeLog, Video>;
  };
}

PracticeLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
      comment: "연습 기록의 고유번호",
    },
    memo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "",
      comment: "연주자가 연습한 후에 남긴 소감 내용",
    },
    time: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      comment: "연주자가 연습한 시간",
    },
    view: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "연습 기록의 조회수",
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "연주자가 연습을 시작한 시간",
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    modelName: "practice_log",
    initialAutoIncrement: "1",
    sequelize,
  }
);
