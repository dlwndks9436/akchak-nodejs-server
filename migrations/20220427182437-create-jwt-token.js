"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jwt_token", {
      player_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        unique: true,
        references: {
          model: {
            tableName: "player",
          },
          key: "id",
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
        comment: "JWT 토큰을 발급 받은 연주자",
      },
      token: {
        type: Sequelize.STRING(140),
        allowNull: false,
        comment: "JWT 토큰",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("jwt_token");
  },
};
