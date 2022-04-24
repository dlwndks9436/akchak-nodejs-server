import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import Phrase from "./phrase";

interface BookModelAttributes extends BookCreationAttributes {
  id: number;
}

interface BookCreationAttributes {
  title: string;
  author: string;
}

export default class Book extends Model<
  BookModelAttributes,
  BookCreationAttributes
> {
  declare id: number;
  declare title: string;
  declare author: string;
  declare created_at: Date;
  declare updated_at: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
      comment: "교본의 고유번호",
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "교본의 제목",
    },
    author: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "교본의 저자",
    },
  },
  {
    modelName: "book",
    timestamps: false,
    initialAutoIncrement: "1",
    sequelize,
  }
);
