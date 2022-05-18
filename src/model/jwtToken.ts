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

export default class JWTToken extends Model<
  InferAttributes<JWTToken>,
  InferCreationAttributes<JWTToken>
> {
  declare player_id: ForeignKey<Player["id"]>;
  declare token: string;

  declare player?: NonAttribute<Player>;
}

JWTToken.init(
  {
    player_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      unique: true,
      references: {
        model: Player,
        key: "id",
      },
      allowNull: false,
      comment: "JWT 토큰을 발급 받은 연주자",
    },
    token: {
      type: DataTypes.STRING(140),
      allowNull: false,
      comment: "JWT 토큰",
    },
  },
  {
    sequelize,
    modelName: "jwt_token",
    timestamps: false,
    initialAutoIncrement: "1",
    hooks: {
      afterCreate: async (token) => {
        const [results, metadata] = await sequelize.query(
          "CREATE EVENT destroy_jwt_token" +
            token.player_id +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 30 DAY DO DELETE FROM jwt_token WHERE id = " +
            token.player_id
        );
        console.log("results of jwt_token delete event: ", results);
        console.log("metadata of jwt_token delete event: ", metadata);
      },
      afterUpdate: async (token) => {
        const [results, metadata] = await sequelize.query(
          "ALTER EVENT destroy_jwt_token" +
            token.player_id +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 30 DAY DO DELETE FROM jwt_token WHERE id = " +
            token.player_id
        );
        console.log("results of jwt_token delete event: ", results);
        console.log("metadata of jwt_token delete event: ", metadata);
      },
      beforeDestroy: async (token) => {
        const [results, metadata] = await sequelize.query(
          "DROP EVENT IF EXISTS destroy_jwt_token" + token.player_id
        );
        console.log("results of jwt_token delete event: ", results);
        console.log("metadata of jwt_token delete event: ", metadata);
      },
    },
  }
);
