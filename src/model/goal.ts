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
  player: number;
  phrase: number;
  music: number;
  subject: number;
}

export default class Goal extends Model<
  GoalModelAttributes,
  GoalCreationAttributes
> {
  declare id: number;
  declare player: number;
  declare phrase: number;
  declare music: number;
  declare subject: number;
  declare created_at: Date;
  declare updated_at: Date;
}

Goal.belongsTo(Subject, {
  foreignKey: {
    name: "subject",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Goal.belongsTo(Music, {
  foreignKey: {
    name: "music",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Goal.belongsTo(Phrase, {
  foreignKey: {
    name: "phrase",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Goal.belongsTo(Player, {
  foreignKey: {
    allowNull: false,
    name: "player",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Goal.hasMany(PracticeLog, {
  foreignKey: {
    allowNull: false,
    name: "goal",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

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
    player: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "연습 목표를 만든 연주자의 고유번호",
      references: {
        model: Player,
        key: "id",
      },
    },
    phrase: {
      type: DataTypes.INTEGER.UNSIGNED,
      comment: "연습 목표로 설정한 프레이즈의 고유번호",
      references: {
        model: Phrase,
        key: "id",
      },
    },
    music: {
      type: DataTypes.INTEGER.UNSIGNED,
      comment: "연습 목표로 설정한 음악의 고유번호",
      references: {
        model: Music,
        key: "id",
      },
    },
    subject: {
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
