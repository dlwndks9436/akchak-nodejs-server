"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("verification_code", {
      player_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        unique: true,
        comment: "인증 코드를 발급 받는 연주자",
      },
      code: {
        type: Sequelize.STRING(6),
        allowNull: false,
        comment: "인증 코드",
      },
    });
    await queryInterface.addConstraint("verification_code", {
      fields: ["player_id"],
      type: "foreign key",
      name: "fk_verificationcode_player",
      references: {
        table: "player",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "verification_code",
      "fk_verificationcode_player"
    );
    await queryInterface.dropTable("verification_code");
  },
};
