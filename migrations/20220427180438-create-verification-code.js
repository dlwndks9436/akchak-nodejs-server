"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("verification_code", {
      player_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        references: {
          model: {
            tableName: "player",
          },
          key: "id",
        },
        comment: "인증 코드를 발급 받는 연주자",
      },
      code: {
        type: Sequelize.STRING(6),
        allowNull: false,
        comment: "인증 코드",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("verification_code");
  },
};
