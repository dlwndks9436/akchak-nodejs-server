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
import Music from "./music";
import Phrase from "./phrase";
import Player from "./player";
import PracticeLog from "./practicelog";
import Subject from "./subject";

export default class Goal extends Model<
  InferAttributes<Goal>,
  InferCreationAttributes<Goal>
> {
  declare id: CreationOptional<number>;
  declare player_id: ForeignKey<Player["id"]>;
  declare phrase_id: ForeignKey<Phrase["id"]>;
  declare music_id: ForeignKey<Music["id"]>;
  declare subject_id: ForeignKey<Subject["id"]>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare player?: NonAttribute<Player>;
  declare phrase?: NonAttribute<Phrase>;
  declare music?: NonAttribute<Music>;
  declare subject?: NonAttribute<Subject>;

  declare practice_logs?: NonAttribute<PracticeLog[]>;

  declare static associations: {
    practice_logs: Association<Goal, PracticeLog>;
  };
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    modelName: "goal",
    initialAutoIncrement: "1",
    sequelize,
  }
);
