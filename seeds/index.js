let faker = require('faker');


let seedData = {};

seedData.productNames = (function() {
    let names = [];
    for (let i = 0; i < 30; i++) {
        names.push(faker.commerce.productName());
    }
    return names;
})();
seedData.categories = [];


module.exports = seedData;
