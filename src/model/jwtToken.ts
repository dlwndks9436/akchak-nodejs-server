import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import Player from "./player";

/**
 * @swagger
 * components:
 *  schemas:
 *    tokens:
 *      description: "Schema for access token and refresh token"
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ1MTk2MDYzLCJleHAiOjE2NDUxOTYxODN9.mXVh6rh-k54fB_KiD-4n-7vpzALWLAgB3d91CqwjBtk"
 *        refresToken:
 *          type: string
 *          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ1NDI1NzgzLCJleHAiOjE2NDgwMTc3ODN9.SRxcjv0nWht25qDuzxPkn1OvnUQkJfG-v8VbOs5OpM4"
 */

interface JWTTokenCreationAttributes {
  player: number;
  token: string;
}

export default class JWTToken extends Model<
  JWTTokenCreationAttributes,
  JWTTokenCreationAttributes
> {
  declare player: number;
  declare token: string;
}

JWTToken.belongsTo(Player, {
  foreignKey: {
    allowNull: false,
    name: "player",
  },
  constraints: true,
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

JWTToken.init(
  {
    player: {
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
            token.player +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 30 DAY DO DELETE FROM jwt_token WHERE id = " +
            token.player
        );
        console.log("results of jwt_token delete event: ", results);
        console.log("metadata of jwt_token delete event: ", metadata);
      },
      afterUpdate: async (token) => {
        const [results, metadata] = await sequelize.query(
          "ALTER EVENT destroy_jwt_token" +
            token.player +
            " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 30 DAY DO DELETE FROM jwt_token WHERE id = " +
            token.player
        );
        console.log("results of jwt_token delete event: ", results);
        console.log("metadata of jwt_token delete event: ", metadata);
      },
      beforeDestroy: async (token) => {
        const [results, metadata] = await sequelize.query(
          "DROP EVENT IF EXISTS destroy_jwt_token" + token.player
        );
        console.log("results of jwt_token delete event: ", results);
        console.log("metadata of jwt_token delete event: ", metadata);
      },
    },
  }
);
