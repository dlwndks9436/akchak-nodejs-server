import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from ".";
import Player from "./player";

export default class VerificationCode extends Model<
  InferAttributes<VerificationCode>,
  InferCreationAttributes<VerificationCode>
> {
  declare player_id: ForeignKey<Player["id"]>;
  declare code: string;

  declare player?: NonAttribute<Player>;
}

VerificationCode.init(
  {
    player_id: {
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
            code.player_id +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 310 SECOND DO DELETE FROM verification_code WHERE player_id = " +
            code.player_id
        );
        console.log("results of code delete event: ", results);
        console.log("metadata of code delete event: ", metadata);
      },
      afterUpdate: async (code) => {
        const [results, metadata] = await sequelize.query(
          "ALTER EVENT destroy_verification_code" +
            code.player_id +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 310 SECOND DO DELETE FROM verification_code WHERE player_id = " +
            code.player_id
        );
        console.log("results of code delete event: ", results);
        console.log("metadata of code delete event: ", metadata);
      },
      beforeDestroy: async (code) => {
        const [results, metadata] = await sequelize.query(
          "DROP EVENT IF EXISTS destroy_verification_code" + code.player_id
        );
        console.log("results of code delete event: ", results);
        console.log("metadata of code delete event: ", metadata);
      },
    },
    sequelize,
  }
);
