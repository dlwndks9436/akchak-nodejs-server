"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("music", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        comment: "음악의 고유번호",
      },
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "음악의 제목",
      },
      artist: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: "음악과 관련된 아티스트의 이름",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("music");
  },
};
