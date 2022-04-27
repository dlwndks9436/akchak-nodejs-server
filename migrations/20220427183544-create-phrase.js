"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("phrase", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        comment: "교본 안에 있는 프레이즈의 고유번호",
      },
      title: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: "교본 안에 있는 프레이즈의 제목",
      },
      subheading: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: "교본 안에 있는 프레이즈의 부제목",
      },
      book: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: "book",
          },
          key: "id",
        },
        allowNull: false,
        comment: "프레이즈가 속한 교본의 고유번호",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("phrase");
  },
};
