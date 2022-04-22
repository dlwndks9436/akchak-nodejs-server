import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import Goal from "./goal";

interface SubjectModelAttributes extends SubjectCreationAttributes {
  id: number;
}

interface SubjectCreationAttributes {
  name: string;
}

export default class Subject extends Model<
  SubjectModelAttributes,
  SubjectCreationAttributes
> {
  declare id: number;
  declare name: string;
}

Subject.hasMany(Goal, {
  foreignKey: {
    name: "subject",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

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
