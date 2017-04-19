'use strict';
let db = require('../../models/sequelize');
let faker = require('faker');
let Category = db.Category;
let defaultCategories = Category.defaultCategory();

module.exports = {
  up: function (queryInterface, Sequelize) {
    let categories = []
      for (let i = 0; i < 4; i++) {
          categories.push({
              name: defaultCategories[i]
          });
      }

      return queryInterface.bulkInsert('Categories', categories);

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Categories', null, {}, db.Category);
  }
};
