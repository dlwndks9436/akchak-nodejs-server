"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "phrase",
          "page",
          {
            type: Sequelize.SMALLINT.UNSIGNED,
            allowNull: false,
            comment: "교본 안에 있는 프레이즈가 위치한 페이지",
          },
          { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("phrase", "page", { transaction: t }),
      ]);
    });
  },
};
