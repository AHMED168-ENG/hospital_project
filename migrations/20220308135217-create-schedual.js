"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("scheduals", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Sunday: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      Monday: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      Tuesday: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      Wednesday: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      Thursday: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      Friday: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      Saturday: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      doctorId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("scheduals");
  },
};
