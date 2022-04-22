import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import Player from "./player";

interface VerificationCodeCreationAttributes {
  player: number;
  code: string;
}

export default class VerificationCode extends Model<
  VerificationCodeCreationAttributes,
  VerificationCodeCreationAttributes
> {
  declare player: number;
  declare code: string;
}

VerificationCode.belongsTo(Player, {
  foreignKey: {
    allowNull: false,
    name: "player",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

VerificationCode.init(
  {
    player: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      unique: true,
      references: {
        model: Player,
        key: "id",
      },
      comment: "인증 코드를 발급 받는 연주자",
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
      comment: "인증 코드",
    },
  },
  {
    modelName: "verification_code",
    timestamps: false,
    initialAutoIncrement: "1",
    hooks: {
      afterCreate: async (code) => {
        const [results, metadata] = await sequelize.query(
          "CREATE EVENT destroy_verification_code" +
            code.player +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 5 MINUTE DO DELETE FROM verification_code WHERE id = " +
            code.player
        );
        console.log("results of code delete event: ", results);
        console.log("metadata of code delete event: ", metadata);
      },
      afterUpdate: async (code) => {
        const [results, metadata] = await sequelize.query(
          "ALTER EVENT destroy_verification_code" +
            code.player +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 5 MINUTE DO DELETE FROM verification_code WHERE id = " +
            code.player
        );
        console.log("results of code delete event: ", results);
        console.log("metadata of code delete event: ", metadata);
      },
      beforeDestroy: async (code) => {
        const [results, metadata] = await sequelize.query(
          "DROP EVENT IF EXISTS destroy_verification_code" + code.player
        );
        console.log("results of code delete event: ", results);
        console.log("metadata of code delete event: ", metadata);
      },
    },
    sequelize,
  }
);
