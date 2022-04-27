import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from ".";
import Goal from "./goal";

export default class Subject extends Model<
  InferAttributes<Subject>,
  InferCreationAttributes<Subject>
> {
  declare id: CreationOptional<number>;
  declare name: string;

  declare goals?: NonAttribute<Goal[]>;

  declare static associations: {
    goals: Association<Subject, Goal>;
  };
}

Subject.init(
  {
    id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
      comment: "목표로 설정한 주제의 고유번호",
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: "목표로 설정한 주제의 내용",
    },
  },
  {
    modelName: "subject",
    initialAutoIncrement: "1",
    timestamps: false,
    sequelize,
  }
);
