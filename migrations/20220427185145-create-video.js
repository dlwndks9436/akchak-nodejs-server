"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("video", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        comment: "연주자가 녹화한 영상의 고유번호",
      },
      s3_key: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: "영상이 저장할 때 사용한 s3 key",
      },
      playback_time: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: false,
        comment: "영상의 재생시간",
      },
      file_size: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: false,
        comment: "영상 파일의 용량 크기",
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
        comment: "연주 영상이 속한 연습 기록",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("video");
  },
};
