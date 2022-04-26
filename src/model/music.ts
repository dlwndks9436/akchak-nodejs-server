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

export default class Music extends Model<
  InferAttributes<Music>,
  InferCreationAttributes<Music>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare artist: string;

  declare goals?: NonAttribute<Goal[]>;

  declare static associations: {
    goals: Association<Music, Goal>;
  };
}

Music.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
      comment: "음악의 고유번호",
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "음악의 제목",
    },
    artist: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "음악과 관련된 아티스트의 이름",
    },
  },
  {
    modelName: "music",
    timestamps: false,
    initialAutoIncrement: "1",
    sequelize,
  }
);
