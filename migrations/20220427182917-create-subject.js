"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subject", {
      id: {
        type: Sequelize.SMALLINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        comment: "목표로 설정한 주제의 고유번호",
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        comment: "목표로 설정한 주제의 내용",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("subject");
  },
};
