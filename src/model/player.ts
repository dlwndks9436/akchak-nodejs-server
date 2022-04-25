import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import Book from "./book";
import Goal from "./goal";
import JWTToken from "./jwtToken";
import Like from "./like";
import Music from "./music";
import Phrase from "./phrase";
import PracticeLog from "./practicelog";
import Subject from "./subject";
import VerificationCode from "./verificationCode";
import Video from "./video";

interface PlayerModelAttributes extends PlayerCreationAttributes {
  id: number;
  unregistered_at: Date;
  banned_until: Date;
  authorized: boolean;
  profile_picture: string;
}

interface PlayerCreationAttributes {
  email: string;
  username: string;
  password: string;
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
    hooks: {
      afterCreate: async (user) => {
        const [results, metadata] = await sequelize.query(
          "CREATE EVENT clearPlayer" +
            user.id +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 12 HOUR DO DELETE FROM player WHERE id = " +
            user.id
        );
        console.log("results of user delete event: ", results);
        console.log("metadata of user delete event: ", metadata);
      },
      afterDestroy: async (user) => {
        const [results, metadata] = await sequelize.query(
          "DROP EVENT IF EXISTS clearPlayer" + user.id
        );
        console.log("results of user delete event: ", results);
        console.log("metadata of user delete event: ", metadata);
      },
    },
    sequelize,
  }
);

Book.hasMany(Phrase, {
  foreignKey: {
    name: "book_id",
    allowNull: false,
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Goal.belongsTo(Subject, {
  foreignKey: {
    name: "subject_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Goal.belongsTo(Music, {
  foreignKey: {
    name: "music_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Goal.belongsTo(Phrase, {
  foreignKey: {
    name: "phrase_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Goal.belongsTo(Player, {
  foreignKey: {
    allowNull: false,
    name: "player_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Goal.hasMany(PracticeLog, {
  foreignKey: {
    allowNull: false,
    name: "goal_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

JWTToken.belongsTo(Player, {
  foreignKey: {
    allowNull: false,
    name: "player_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Like.belongsTo(PracticeLog, {
  foreignKey: {
    allowNull: false,
    name: "practice_log_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Like.belongsTo(Player, {
  foreignKey: {
    allowNull: false,
    name: "player_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Music.hasMany(Goal, {
  foreignKey: {
    name: "music_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Phrase.belongsTo(Book, {
  foreignKey: {
    allowNull: false,
    name: "book_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Phrase.hasMany(Goal, {
  foreignKey: {
    name: "phrase_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Player.hasMany(Like, {
  foreignKey: {
    allowNull: false,
    name: "player_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Player.hasMany(PracticeLog, {
  foreignKey: {
    allowNull: false,
    name: "player_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Player.hasMany(Goal, {
  foreignKey: {
    allowNull: false,
    name: "player_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Player.hasOne(VerificationCode, {
  foreignKey: {
    allowNull: false,
    name: "player_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Player.hasOne(JWTToken, {
  foreignKey: {
    allowNull: false,
    name: "player_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

PracticeLog.belongsTo(Goal, {
  foreignKey: {
    allowNull: false,
    name: "goal_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

PracticeLog.belongsTo(Player, {
  foreignKey: {
    allowNull: false,
    name: "player_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

PracticeLog.hasOne(Video, {
  foreignKey: {
    allowNull: false,
    name: "practice_log_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

PracticeLog.hasMany(Like, {
  foreignKey: {
    allowNull: false,
    name: "practice_log_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Subject.hasMany(Goal, {
  foreignKey: {
    name: "subject_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

VerificationCode.belongsTo(Player, {
  foreignKey: {
    allowNull: false,
    name: "player_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Video.belongsTo(PracticeLog, {
  foreignKey: {
    allowNull: false,
    name: "practice_log_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
