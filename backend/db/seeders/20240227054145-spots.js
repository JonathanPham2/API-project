'use strict';
const { QueryError } = require("sequelize");
const { Spot } = require("../models")

/** @type {import('sequelize-cli').Migration} */
let options = {};
if(process.env.NODE_ENV=== "production"){
  options.schema = process.env.SCHEMA
}
module.exports = {
  async up (queryInterface, Sequelize) {
   await Spot.bulkCreate([
    {
      ownerId: 3,
      address: "5 Đ. Thanh Niên, Yên Phụ",
      city: "Hanoi",
      state: "North",
      country: "Vietnam",
      lat: 21.049141,
      lng: 105.836963,
      name: "Hanoi",
      description: "A serene getaway offering a peaceful stay with lake views in the heart of Hanoi.",
      price: 100.0,
      
    },
    {
      ownerId: 1,
      address: "10 Bùi Viện, Phạm Ngũ Lão",
      city: "Ho Chi Minh City",
      state: "South",
      country: "Vietnam",
      lat: 10.766888,
      lng: 106.692256,
      name: "SaiGon",
      description: "Experience the bustling city life of Ho Chi Minh City from this centrally located apartment.",
      price: 80.0,
     
    },
    {
      ownerId: 2,
      address: "14 Ngô Quyền, Minh An",
      city: "Hoi An",
      state: "Quang Nam",
      country: "Vietnam",
      lat: 15.879845,
      lng: 108.328775,
      name: "Hoi An",
      description: "A charming retreat in the historic heart of Hoi An, perfect for cultural explorations.",
      price: 70.0,
     
    },
    {
      ownerId: 1,
      address: "12 Trần Phú, Lộc Thọ",
      city: "Nha Trang",
      state: "Khanh Hoa",
      country: "Vietnam",
      lat: 12.238791,
      lng: 109.196749,
      name: "Nha Trang Beach",
      description: "Enjoy the best of Nha Trang with a stay at this beachfront residence offering stunning sea views.",
      price: 110.0,
     
    },
    {
      ownerId: 3,
      address: "2 Thác Bạc, Sa Pa",
      city: "Sa Pa",
      state: "Lao Cai",
      country: "Vietnam",
      lat: 22.336361,
      lng: 103.843785,
      name: "Sa Pa Mountain",
      description: "Escape to the mountains with this sanctuary in Sa Pa, offering breathtaking views and serene surroundings.",
      price: 90.0,
   
    }
  ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
  options.tableName = "Spots";
  await queryInterface.bulkDelete(options)
  }
};
