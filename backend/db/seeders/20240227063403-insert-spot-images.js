'use strict';

/** @type {import('sequelize-cli').Migration} */
const { SpotImage } = require("../models");
let options = {}
if(process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA
}
module.exports = {
  async up (queryInterface, Sequelize) {
  await SpotImage.bulkCreate([
    {spotId: 1, url: "https://example.com/saigon1", preview: true},
    {spotId: 1, url: "https://example.com/saigon2", preview: false},
    {spotId: 2, url: "https://example.com/hanoi1", preview: true},
    {spotId: 2, url: "https://example.com/hanoi2", preview: false},
    {spotId: 3, url: "https://res.cloudinary.com/dzuhij5io/image/upload/v1710762109/luxury-unfurnished-villa-for-rent-in-ciputra-hanoi_20205161614_ikxsco.jpg", preview: true},
    {spotId: 3, url: "https://example.com/danang2", preview: false},
    {spotId: 4, url: "https://example.com/hue1", preview: true},
    {spotId: 4, url: "https://example.com/hue2", preview: false},
    {spotId: 5, url: "https://example.com/nhatrang1", preview: true},
    {spotId: 5, url: "https://example.com/nhatrang2", preview: false}
  ],{validate:true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkDelete(options)
  }
};
