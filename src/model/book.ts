import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from ".";
import Phrase from "./phrase";

export default class Book extends Model<
  InferAttributes<Book>,
  InferCreationAttributes<Book>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare author: string;

  declare getPhrases: HasManyGetAssociationsMixin<Phrase>;
  declare addPhrase: HasManyAddAssociationMixin<Phrase, number>;
  declare addPhrases: HasManyAddAssociationsMixin<Phrase, number>;
  declare setPhrases: HasManySetAssociationsMixin<Phrase, number>;
  declare removePhrase: HasManyRemoveAssociationMixin<Phrase, number>;
  declare removePhrases: HasManyRemoveAssociationsMixin<Phrase, number>;
  declare hasPhrase: HasManyHasAssociationMixin<Phrase, number>;
  declare hasPhrases: HasManyHasAssociationsMixin<Phrase, number>;
  declare countPhrases: HasManyCountAssociationsMixin;
  declare createPhrase: HasManyCreateAssociationMixin<Phrase, "book_id">;

  declare phrases?: NonAttribute<Phrase[]>;

  declare static associations: {
    phrases: Association<Book, Phrase>;
  };
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
