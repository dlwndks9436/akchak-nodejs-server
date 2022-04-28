"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "goal",
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          unique: true,
          comment: "연습 목표의 고유번호",
        },
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        player_id: {
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
        phrase_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: {
              tableName: "phrase",
            },
            key: "id",
          },
          comment: "연습 목표로 설정한 프레이즈",
        },
        music_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: {
              tableName: "music",
            },
            key: "id",
          },
          comment: "연습 목표로 설정한 음악",
        },
        subject_id: {
          type: Sequelize.SMALLINT.UNSIGNED,
          references: {
            model: {
              tableName: "subject",
            },
            key: "id",
          },
          comment: "연습 목표로 설정한 주제",
        },
      },
      {
        timestamps: true,
        underscored: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("goal");
  },
};
