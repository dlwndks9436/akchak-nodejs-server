"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "player",
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          unique: true,
          comment: "연주자의 고유번호",
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
          comment: "연주자의 이메일 주소",
        },
        password: {
          type: Sequelize.STRING(60),
          allowNull: false,
          comment: "연주자의 비밀번호",
        },
        username: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: true,
          comment: "연주자의 가명",
        },
        profile_picture: {
          type: Sequelize.UUID,
          comment: "연주자의 프로필 사진의 s3 key",
        },
        authorized: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: "연주자의 이메일 인증 여부",
        },
        banned_until: {
          type: Sequelize.DATEONLY,
          comment: "연주자의 계정 정지 기간",
        },
        unregistered_at: {
          type: Sequelize.DATEONLY,
          comment: "연주자가 회원탈퇴한 날짜",
        },
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
      },
      {
        timestamps: true,
        underscored: true,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("player");
  },
};
