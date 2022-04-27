"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("goal", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        comment: "연습 목표의 고유번호",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      player: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: "player",
          },
          key: "id",
        },
        allowNull: false,
        comment: "연습 목표를 설정한 연주자",
      },
      phrase: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: "phrase",
          },
          key: "id",
        },
        comment: "연습 목표로 설정한 프레이즈",
      },
      music: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: "music",
          },
          key: "id",
        },
        comment: "연습 목표로 설정한 음악",
      },
      subject: {
        type: Sequelize.SMALLINT.UNSIGNED,
        references: {
          model: {
            tableName: "subject",
          },
          key: "id",
        },
        comment: "연습 목표로 설정한 주제",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("goal");
  },
};
