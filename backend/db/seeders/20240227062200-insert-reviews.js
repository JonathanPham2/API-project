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
      {spotId: 1, userId: 1, review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", stars: 5},
      {spotId: 2, userId: 2, review: "Review 2 text.", stars: 5},
      {spotId: 3, userId: 3, review: "Review 3 text.", stars: 5},
      {spotId: 4, userId: 4, review: "Review 4 text.", stars: 5},
      {spotId: 1, userId: 5, review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Molestie at elementum eu facilisis sed odio. Platea dictumst quisque sagittis purus sit amet volutpat consequat. Leo vel orci porta non pulvinar. Purus sit amet luctus venenatis lectus magna. Sed enim ut sem viverra aliquet eget. Ut lectus arcu bibendum at varius vel pharetra. Nunc mattis enim ut tellus elementum sagittis vitae et leo. Et odio pellentesque diam volutpat commodo sed egestas egestas. Nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae. Fames ac turpis egestas sed. Eget nunc lobortis mattis aliquam faucibus purus in massa tempor. Sed id semper risus in hendrerit gravida. Commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae. Consectetur a erat nam at lectus urna duis convallis. Massa eget egestas purus viverra. Dignissim sodales ut eu sem integer vitae.", stars: 4},
      {spotId: 5, userId: 5, review: "Review 5 text.", stars: 4},

    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
   options.tableName = "Reviews";
   await queryInterface.bulkDelete(options)
  }
};
