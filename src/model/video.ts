import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from ".";
import PracticeLog from "./practicelog";

export default class Video extends Model<
  InferAttributes<Video>,
  InferCreationAttributes<Video>
> {
  declare id: CreationOptional<number>;
  declare practicelog_id: ForeignKey<PracticeLog["id"]>;
  declare file_name: string;
  declare file_name_ext: string;
  declare playback_time: number;
  declare file_size: number;

  declare practice_log?: NonAttribute<PracticeLog>;
}

Video.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
      comment: "연주자가 녹화한 영상의 고유번호",
    },
    file_name: {
      type: DataTypes.STRING(15),
      allowNull: false,
      comment: "영상의 파일 이름",
    },
    file_name_ext: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "확장자를 포함한 영상의 파일 이름",
    },
    playback_time: {
      type: DataTypes.FLOAT().UNSIGNED,
      allowNull: false,
      comment: "영상의 재생시간",
    },
    file_size: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      comment: "영상 파일의 용량 크기",
    },
  },
  {
    modelName: "video",
    timestamps: false,
    initialAutoIncrement: "1",
    sequelize,
  }
);
