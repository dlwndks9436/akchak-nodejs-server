import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import Music from "./music";
import Phrase from "./phrase";
import Player from "./player";
import PracticeLog from "./practicelog";
import Subject from "./subject";

interface GoalModelAttributes extends GoalCreationAttributes {
  id: number;
}

interface GoalCreationAttributes {
  player_id: number;
  phrase_id: number;
  music_id: number;
  subject_id: number;
}

export default class Goal extends Model<
  GoalModelAttributes,
  GoalCreationAttributes
> {
  declare id: number;
  declare player_id: number;
  declare phrase_id: number;
  declare music_id: number;
  declare subject_id: number;
  declare created_at: Date;
  declare updated_at: Date;
}

Goal.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
      comment: "연습 목표의 고유번호",
    },
    player_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "연습 목표를 만든 연주자의 고유번호",
      references: {
        model: Player,
        key: "id",
      },
    },
    phrase_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      comment: "연습 목표로 설정한 프레이즈의 고유번호",
      references: {
        model: Phrase,
        key: "id",
      },
    },
    music_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      comment: "연습 목표로 설정한 음악의 고유번호",
      references: {
        model: Music,
        key: "id",
      },
    },
    subject_id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      comment: "연습 목표로 설정한 주제의 고유번호",
      references: {
        model: Subject,
        key: "id",
      },
    },
  },
  {
    modelName: "goal",
    initialAutoIncrement: "1",
    sequelize,
  }
);
