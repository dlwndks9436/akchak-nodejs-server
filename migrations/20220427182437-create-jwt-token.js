"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jwt_token", {
      player_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        unique: true,
        allowNull: false,
        comment: "JWT 토큰을 발급 받은 연주자",
      },
      token: {
        type: Sequelize.STRING(140),
        allowNull: false,
        comment: "JWT 토큰",
      },
    });
    await queryInterface.addConstraint("jwt_token", {
      fields: ["player_id"],
      type: "foreign key",
      name: "fk_jwttoken_player",
      references: {
        table: "player",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("jwt_token", "fk_jwttoken_player");
    await queryInterface.dropTable("jwt_token");
  },
};
