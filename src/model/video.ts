import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import PracticeLog from "./practicelog";

interface VideoModelAttributes extends VideoCreationAttributes {
  id: number;
}

interface VideoCreationAttributes {
  practice_log_id: number;
  s3_key: string;
  playback_time: number;
  file_size: number;
}

export default class Video extends Model<
  VideoModelAttributes,
  VideoCreationAttributes
> {
  declare id: number;
  declare practice_log_id: number;
  declare s3_key: string;
  declare playback_time: number;
  declare file_size: number;
  declare created_at: Date;
  declare updated_at: Date;
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
    practice_log_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      comment: "영상이 녹화된 연습 기록의 고유번호",
      references: {
        model: PracticeLog,
        key: "id",
      },
    },
    s3_key: {
      type: DataTypes.STRING(40),
      allowNull: false,
      comment: "영상이 저장할 때 사용한 s3 key",
    },
    playback_time: {
      type: DataTypes.SMALLINT.UNSIGNED,
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
