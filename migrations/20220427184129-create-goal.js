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
          allowNull: false,
          comment: "연습 목표를 설정한 연주자",
        },
        phrase_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          comment: "연습 목표로 설정한 프레이즈",
        },
        music_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          comment: "연습 목표로 설정한 음악",
        },
      },
      {
        timestamps: true,
        underscored: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );
    await queryInterface.addConstraint("goal", {
      fields: ["player_id"],
      type: "foreign key",
      name: "fk_goal_player",
      references: {
        table: "player",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("goal", {
      fields: ["phrase_id"],
      type: "foreign key",
      name: "fk_goal_phrase",
      references: {
        table: "phrase",
        field: "id",
      },
      onDelete: "restrict",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("goal", {
      fields: ["music_id"],
      type: "foreign key",
      name: "fk_goal_music",
      references: {
        table: "music",
        field: "id",
      },
      onDelete: "restrict",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("goal", "fk_goal_player");
    await queryInterface.removeConstraint("goal", "fk_goal_phrase");
    await queryInterface.removeConstraint("goal", "fk_goal_music");
    await queryInterface.dropTable("goal");
  },
};
