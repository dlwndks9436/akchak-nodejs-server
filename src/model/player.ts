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
import Book from "./book";
import Goal from "./goal";
import JWTToken from "./jwtToken";
import Like from "./like";
import Music from "./music";
import Phrase from "./phrase";
import PracticeLog from "./practicelog";
import VerificationCode from "./verificationCode";
import Video from "./video";

export default class Player extends Model<
  InferAttributes<Player>,
  InferCreationAttributes<Player>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare username: string;
  declare password: string;
  declare authorized: CreationOptional<boolean>;
  declare profile_picture: CreationOptional<string | null>;
  declare unregistered_at: CreationOptional<Date | null>;
  declare banned_until: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare likes?: NonAttribute<Like[]>;
  declare practice_logs?: NonAttribute<PracticeLog[]>;
  declare goals?: NonAttribute<Goal[]>;
  declare verification_code?: NonAttribute<VerificationCode>;
  declare jwt_token?: NonAttribute<JWTToken>;

  declare static associations: {
    likes: Association<Player, Like>;
    practice_logs: Association<Player, PracticeLog>;
    goals: Association<Player, Goal>;
    verification_code: Association<Player, VerificationCode>;
    jwt_token: Association<Player, JWTToken>;
  };
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
      type: DataTypes.UUID,
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
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
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
    name: "practicelog_id",
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
    name: "practicelog_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

PracticeLog.hasMany(Like, {
  foreignKey: {
    allowNull: false,
    name: "practicelog_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
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
    name: "practicelog_id",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
