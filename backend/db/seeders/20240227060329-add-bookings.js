'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Booking } = require("../models")
let options = {}
if(process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA 
}
module.exports = {
  async up (queryInterface, Sequelize) {
   await Booking.bulkCreate([
    {
      spotId: 2,
      userId: 3,
      startDate: '2024-01-03',
      endDate: '2024-01-07'
    },
    {
      spotId: 1,
      userId: 1,
      startDate: '2024-01-04',
      endDate: '2024-01-05'
    },
    {
      spotId: 5,
      userId: 2,
      startDate: '2021-01-22',
      endDate: '2026-01-24'
    },
   
  ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Bookings"
    await queryInterface.bulkDelete(options)
  }
};
