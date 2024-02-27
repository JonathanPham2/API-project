'use strict';

/** @type {import('sequelize-cli').Migration} */
const { ReviewImage } = require("../models")
let options = {};
if(process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA
}
module.exports = {
  async up (queryInterface, Sequelize) {
   await ReviewImage.bulkCreate([
    {
      reviewId: 7,
      url: "https://example.com/image2.jpg"
    },
    {
      reviewId: 4,
      url: "https://example.com/image45.jpg"
    },
  
    {
      reviewId: 4,
      url: "https://example.com/image34.jpg"
    },
    {
      reviewId: 2,
      url: "https://example.com/image20.jpg"
    },
    {
      reviewId: 2,
      url: "https://example.com/image96.jpg"
    },
    {
      reviewId: 7,
      url: "https://example.com/image83.jpg"
    },
    {
      reviewId: 9,
      url: "https://example.com/image89.jpg"
    },
    {
      reviewId: 8,
      url: "https://example.com/image49.jpg"
    },
    {
      reviewId: 5,
      url: "https://example.com/image95.jpg"
    },
    {
      reviewId: 5,
      url: "https://example.com/image98.jpg"
    }
  ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
   options.tableName = "ReviewImages";
   await queryInterface.bulkDelete(options)
  }
};
