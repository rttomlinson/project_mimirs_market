'use strict';
let db = require('../../models/sequelize');
let faker = require('faker');

module.exports = {
  up: function (queryInterface, Sequelize) {
   let products = []
      for (let i = 0; i < 20; i++) {
        let catID = Math.floor((Math.random() * 4) + 1);
          products.push({
              name: faker.commerce.productName(),
              sku: faker.random.number(),
              description: faker.lorem.paragraph(),
              price: faker.finance.amount(),
              category_id: catID,
              image_url: "http://placehold.it/350x150"
          });
      }

      return queryInterface.bulkInsert('Products', products);

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
    return queryInterface.bulkDelete('Products', null, {}, db.Product);
  }
};
