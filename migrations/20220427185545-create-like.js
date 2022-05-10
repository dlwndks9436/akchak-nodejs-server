"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("like", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        comment: "좋아요의 고유번호",
      },
      is_like: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: "좋아요 여부",
      },
      practicelog_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: "practice_log",
          },
          key: "id",
        },
        allowNull: false,
        comment: "좋아요를 받은 연습기록",
      },
      player_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: "player",
          },
          key: "id",
        },
        allowNull: false,
        comment: "좋아요를 한 연주자",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("like");
  },
};
