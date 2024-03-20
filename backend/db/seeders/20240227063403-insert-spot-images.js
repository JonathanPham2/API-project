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
    {spotId: 1, url: "https://res.cloudinary.com/dzuhij5io/image/upload/v1710762109/luxury-unfurnished-villa-for-rent-in-ciputra-hanoi_20205161614_ikxsco.jpg", preview: true},
    {spotId: 1, url: "https://res.cloudinary.com/dzuhij5io/image/upload/v1710891471/20240129164410-ff0a_wm_mxtfiu.jpg", preview: false},
    {spotId: 1, url: "https://res.cloudinary.com/dzuhij5io/image/upload/v1710891471/20240129164409-5048_wm_jnu0qc.jpg", preview: false},
    {spotId: 1, url: "https://res.cloudinary.com/dzuhij5io/image/upload/v1710891470/20240129165252-ade3_wm_zqbve8.jpg", preview: false},
    {spotId: 1, url: "https://res.cloudinary.com/dzuhij5io/image/upload/v1710891470/20240129165332-87f5_wm_o2stfq.jpg", preview: false},
    {spotId: 1, url: "https://res.cloudinary.com/dzuhij5io/image/upload/v1710891838/Hoan-Kiem-Lake-6_1662341107_ojbxmm.jpg", preview: false},
    {spotId: 2, url: "https://res.cloudinary.com/dzuhij5io/image/upload/v1710763162/saigon_pqw9na.jpg", preview: true},
    {spotId: 2, url: "https://example.com/hanoi2", preview: false},
    {spotId: 3, url: "https://res.cloudinary.com/dzuhij5io/image/upload/v1710763163/sapa_k68fvp.avif", preview: true},
    {spotId: 3, url: "https://example.com/danang2", preview: false},
    {spotId: 4, url: "https://res.cloudinary.com/dzuhij5io/image/upload/v1710763161/nha_trang_padigz.jpg", preview: true},
    {spotId: 4, url: "https://example.com/hue2", preview: false},
    {spotId: 5, url: "https://res.cloudinary.com/dzuhij5io/image/upload/v1710763161/hoii_an_wfp8pl.jpg", preview: true},
    {spotId: 5, url: "https://example.com/nhatrang2", preview: false}
  ],{validate:true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkDelete(options)
  }
};
