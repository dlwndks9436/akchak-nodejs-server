import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import Book from "./book";
import Goal from "./goal";

interface PhraseModelAttributes extends PhraseCreationAttributes {
  id: number;
}

interface PhraseCreationAttributes {
  book: string;
  title: string;
  subheading: string;
}

export default class Phrase extends Model<
  PhraseModelAttributes,
  PhraseCreationAttributes
> {
  declare id: number;
  declare book: number;
  declare title: string;
  declare subheading: string;
  declare created_at: Date;
  declare updated_at: Date;
}

Phrase.belongsTo(Book, {
  foreignKey: {
    allowNull: false,
    name: "book",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Phrase.hasMany(Goal, {
  foreignKey: {
    name: "phrase",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

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
    book: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "프레이즈가 속한 교본의 고유번호",
      references: {
        model: Book,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "교본 안에 있는 프레이즈의 제목",
    },
    subheading: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "교본 안에 있는 프레이즈의 부제목",
    },
  },
  {
    modelName: "phrase",
    timestamps: false,
    initialAutoIncrement: "1",
    sequelize,
  }
);