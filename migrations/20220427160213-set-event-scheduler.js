"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("SET GLOBAL event_scheduler = ON");
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("SET GLOBAL event_scheduler = OFF");
  },
};
