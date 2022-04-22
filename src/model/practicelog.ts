import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import Goal from "./goal";
import Like from "./like";
import Player from "./player";
import Video from "./video";

interface PracticeLogModelAttributes extends PracticeLogCreationAttributes {
  id: number;
}

interface PracticeLogCreationAttributes {
  goal: number;
  player: number;
  memo: string;
  time: number;
  view: number;
  started_at: Date;
}

export default class PracticeLog extends Model<
  PracticeLogModelAttributes,
  PracticeLogCreationAttributes
> {
  declare id: number;
  declare goal: number;
  declare player: number;
  declare memo: string;
  declare time: number;
  declare view: number;
  declare started_at: Date;
  declare created_at: Date;
  declare updated_at: Date;
}

PracticeLog.belongsTo(Goal, {
  foreignKey: {
    allowNull: false,
    name: "goal",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

PracticeLog.belongsTo(Player, {
  foreignKey: {
    allowNull: false,
    name: "player",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

PracticeLog.hasOne(Video, {
  foreignKey: {
    allowNull: false,
    name: "practice_log",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

PracticeLog.hasMany(Like, {
  foreignKey: {
    allowNull: false,
    name: "practice_log",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

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
    goal: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "연습 기록에 설정된 목표의 고유번호",
      references: {
        model: Goal,
        key: "id",
      },
    },
    player: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "연습 기록을 만든 연주자의 고유번호",
      references: {
        model: Player,
        key: "id",
      },
    },
    memo: {
      type: DataTypes.STRING(200),
      allowNull: false,
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
  },
  {
    modelName: "practice_log",
    initialAutoIncrement: "1",
    sequelize,
  }
);