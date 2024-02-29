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
      reviewId: 1,
      url: "https://example.com/image2.jpg"
    },
    {
      reviewId: 2,
      url: "https://example.com/image45.jpg"
    },
  
    {
      reviewId: 3,
      url: "https://example.com/image34.jpg"
    },
    {
      reviewId: 4,
      url: "https://example.com/image20.jpg"
    },
    {
      reviewId: 5,
      url: "https://example.com/image96.jpg"
    },
    
  ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
   options.tableName = "ReviewImages";
   await queryInterface.bulkDelete(options)
  }
};
