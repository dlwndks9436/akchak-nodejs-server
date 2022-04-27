"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("book", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        comment: "교본의 고유번호",
      },
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "교본의 제목",
      },
      author: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: "교본의 저자",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("book");
  },
};
