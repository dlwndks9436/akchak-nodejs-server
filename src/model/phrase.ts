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
import Book from "./book";
import Goal from "./goal";

export default class Phrase extends Model<
  InferAttributes<Phrase>,
  InferCreationAttributes<Phrase>
> {
  declare id: CreationOptional<number>;
  declare book_id: ForeignKey<Book["id"]>;
  declare title: string;
  declare subheading: string;
  declare page: number;

  declare book?: NonAttribute<Book>;
  declare goals?: NonAttribute<Goal[]>;

  declare static associations: {
    goals: Association<Phrase, Goal>;
  };
}

Phrase.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
      comment: "교본 안에 있는 프레이즈의 고유번호",
    },
    title: {
      type: DataTypes.STRING(40),
      allowNull: false,
      comment: "교본 안에 있는 프레이즈의 제목",
    },
    subheading: {
      type: DataTypes.STRING(40),
      allowNull: false,
      comment: "교본 안에 있는 프레이즈의 부제목",
    },
    page: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      comment: "교본 안에 있는 프레이즈가 위치한 페이지",
    },
  },
  {
    modelName: "phrase",
    timestamps: false,
    initialAutoIncrement: "1",
    sequelize,
  }
);
