import { bool } from "aws-sdk/clients/signer";
import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import Goal from "./goal";
import JWTToken from "./jwtToken";
import Like from "./like";
import PracticeLog from "./practicelog";
import VerificationCode from "./verificationCode";

interface PlayerModelAttributes extends PlayerCreationAttributes {
  id: number;
}

interface PlayerCreationAttributes {
  email: string;
  username: string;
  password: string;
  authorized: boolean;
  profile_picture: string;
  unregistered_at: Date;
  banned_until: Date;
}

export default class Player extends Model<
  PlayerModelAttributes,
  PlayerCreationAttributes
> {
  declare id: number;
  declare email: string;
  declare username: string;
  declare password: string;
  declare authorized: boolean;
  declare profile_picture: string;
  declare unregistered_at: Date;
  declare banned_until: Date;
  declare created_at: Date;
  declare updated_at: Date;
}

Player.hasMany(Like, {
  foreignKey: {
    allowNull: false,
    name: "player",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Player.hasMany(PracticeLog, {
  foreignKey: {
    allowNull: false,
    name: "player",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Player.hasMany(Goal, {
  foreignKey: {
    allowNull: false,
    name: "player",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Player.hasOne(VerificationCode, {
  foreignKey: {
    allowNull: false,
    name: "player",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Player.hasOne(JWTToken, {
  foreignKey: {
    allowNull: false,
    name: "player",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Player.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
      comment: "연주자의 고유번호",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: "연주자의 이메일 주소",
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      comment: "연주자의 비밀번호",
    },
    username: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      comment: "연주자의 가명",
    },
    profile_picture: {
      type: DataTypes.STRING(40),
      comment: "연주자의 프로필 사진의 s3 key",
    },
    authorized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "연주자의 이메일 인증 여부",
    },
    banned_until: {
      type: DataTypes.DATEONLY,
      comment: "연주자의 계정 정지 기간",
    },
    unregistered_at: {
      type: DataTypes.DATEONLY,
      comment: "연주자가 회원탈퇴한 날짜",
    },
  },
  {
    modelName: "player",
    initialAutoIncrement: "1",
    sequelize,
  }
);
