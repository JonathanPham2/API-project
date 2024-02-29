'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Review } = require("../models");
let options = {};
if(process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {spotId: 1, userId: 1, review: "Review 1 text.", stars: 5},
      {spotId: 2, userId: 2, review: "Review 2 text.", stars: 5},
      {spotId: 3, userId: 3, review: "Review 3 text.", stars: 5},
      {spotId: 4, userId: 4, review: "Review 4 text.", stars: 5},
      {spotId: 1, userId: 5, review: "Review 5 text.", stars: 4},
      {spotId: 5, userId: 5, review: "Review 5 text.", stars: 4},

    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
   options.tableName = "Reviews";
   await queryInterface.bulkDelete(options)
  }
};
