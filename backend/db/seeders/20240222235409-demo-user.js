'use strict';
const { User } = require("../models");
const bcrypt = require("bcryptjs");
let options = {}
if(process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await User.bulkCreate([
        {
          username: "Thanhpham",
          email: "ThanhP@gmail.com",
          firstName: "john",
          lastName: "ham",
          hashedPassword: bcrypt.hashSync("password1")
        },
        {
          username: "Demo1",
          email: "Demo1@gmail.com",
          firstName: "jonathan",
          lastName: "nguyen",
          hashedPassword: bcrypt.hashSync("password2")
        },
        {
          username: "Demo2",
          email: "Demo2@gmail.com",
          firstName: "Michael",
          lastName: "dang",
          hashedPassword: bcrypt.hashSync("password3")
        },

      ], {validate: true})
   
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Users";
    const  Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: ["Thanhpham", "Demo1", "Demo2"]
      }
    })
  }
};
