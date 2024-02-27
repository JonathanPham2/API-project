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
      userId: 1,
      startDate: '2024-01-03',
      endDate: '2024-01-07'
    },
    {
      spotId: 1,
      userId: 3,
      startDate: '2024-01-04',
      endDate: '2024-01-05'
    },
    {
      spotId: 5,
      userId: 1,
      startDate: '2024-01-22',
      endDate: '2024-01-24'
    },
    {
      spotId: 4,
      userId: 1,
      startDate: '2024-01-04',
      endDate: '2024-01-13'
    },
    {
      spotId: 5,
      userId: 3,
      startDate: '2024-01-08',
      endDate: '2024-01-19'
    },
    {
      spotId: 1,
      userId: 2,
      startDate: '2026-02-15',
      endDate: '2026-02-20'
    },
    {
      spotId: 2,
      userId: 2,
      startDate: '2027-03-18',
      endDate: '2027-03-31'
    },
    {
      spotId: 3,
      userId: 5,
      startDate: '2028-03-27',
      endDate: '2028-04-08'
    },
    {
      spotId: 5,
      userId: 4,
      startDate: '2029-03-12',
      endDate: '2029-03-20'
    },
    {
      spotId: 4,
      userId: 3,
      startDate: '2030-02-20',
      endDate: '2030-02-27'
    },
    {
      spotId: 5,
      userId: 5,
      startDate: '2030-03-20',
      endDate: '2030-03-23'
    },
    {
      spotId: 2,
      userId: 3,
      startDate: '2029-07-26',
      endDate: '2029-08-08'
    },
    {
      spotId: 3,
      userId: 3,
      startDate: '2024-10-14',
      endDate: '2024-10-23'
    },
    {
      spotId: 4,
      userId: 4,
      startDate: '2024-03-06',
      endDate: '2024-03-13'
    },
    {
      spotId: 3,
      userId: 4,
      startDate: '2025-06-26',
      endDate: '2025-06-29'
    },
    {
      spotId: 2,
      userId: 3,
      startDate: '2024-05-05',
      endDate: '2024-05-06'
    },
    {
      spotId: 5,
      userId: 1,
      startDate: '2024-06-23',
      endDate: '2024-06-30'
    },
    {
      spotId: 4,
      userId: 2,
      startDate: '2024-06-05',
      endDate: '2024-06-15'
    },
    {
      spotId: 5,
      userId: 3,
      startDate: '2025-04-23',
      endDate: '2025-04-30'
    },
    {
      spotId: 4,
      userId: 4,
      startDate: '2025-12-29',
      endDate: '2026-01-05'
    }
  ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Bookings"
    await queryInterface.bulkDelete(options)
  }
};
