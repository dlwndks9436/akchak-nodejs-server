import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import Goal from "./goal";

interface MusicModelAttributes extends MusicCreationAttributes {
  id: number;
}

interface MusicCreationAttributes {
  title: string;
  artist: string;
}

export default class Music extends Model<
  MusicModelAttributes,
  MusicCreationAttributes
> {
  declare id: number;
  declare title: string;
  declare artist: string;
  declare created_at: Date;
  declare updated_at: Date;
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
