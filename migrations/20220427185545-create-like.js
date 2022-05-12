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
        allowNull: false,
        comment: "좋아요를 받은 연습기록",
      },
      player_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "좋아요를 한 연주자",
      },
    });
    await queryInterface.addConstraint("like", {
      fields: ["practicelog_id"],
      type: "foreign key",
      name: "fk_like_practicelog",
      references: {
        table: "practice_log",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("like", {
      fields: ["player_id"],
      type: "foreign key",
      name: "fk_like_player",
      references: {
        table: "player",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("like", "fk_like_practicelog");
    await queryInterface.removeConstraint("like", "fk_like_player");
    await queryInterface.dropTable("like");
  },
};
