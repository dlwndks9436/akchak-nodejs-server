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
        type: Sequelize.STRING(40),
        allowNull: false,
        comment: "교본 안에 있는 프레이즈의 제목",
      },
      subheading: {
        type: Sequelize.STRING(40),
        allowNull: false,
        comment: "교본 안에 있는 프레이즈의 부제목",
      },
      book_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "프레이즈가 속한 교본의 고유번호",
      },
      page: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: false,
        comment: "교본 안에 있는 프레이즈가 위치한 페이지",
      },
    });
    await queryInterface.addConstraint("phrase", {
      fields: ["book_id"],
      type: "foreign key",
      name: "fk_phrase_book",
      references: {
        table: "book",
        field: "id",
      },
      onDelete: "restrict",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("phrase", "fk_phrase_book");
    await queryInterface.dropTable("phrase");
  },
};
