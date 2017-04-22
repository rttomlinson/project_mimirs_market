"use strict";
const faker = require('faker');
const db = require('../../models/sequelize');
const Product = db.Product;
const Category = db.Category;
const h = require('../../helpers').registered;

function makeFakeOrderItems(products) {
    let pickedItems = [];
    let numItems = Math.floor((Math.random() * 6) + 1);
    let orderItems = [];
    for (let i = 0; i < numItems; i++) {
        //pick a random number the length of the list
        let nextItem = Math.floor((Math.random() * products.length));
        //if that number is not in the pickedItems array
        while (pickedItems.includes(nextItem)) {
            nextItem = Math.floor((Math.random() * products.length));
        }
        pickedItems.push(nextItem);
        //get a random quantity and add it to the orderItems
        let quantity = Math.floor((Math.random() * products.length));
        products[nextItem].quantity = quantity;
        orderItems.push(products[nextItem]);
    }
    return orderItems;
}



module.exports = () => {


    return Product.findAll({
            // include: [{
            //     model: Category
            // }],
            attributes: [
                // specify an array where the first element is the SQL function and the second is the alias
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('name')), 'name'], 'description', 'price', 'sku', 'category_id', "id"
            ],
            raw: true
        })
        .then(function(products) {
            console.log("seeding products", products);
            // ----------------------------------------
            // Create Orders
            // ----------------------------------------
            console.log('Creating Orders');
            var orders = [];
            for (let i = 1; i < 10; i++) {
                let cart = makeFakeOrderItems(products);
                var order = new Order({
                    completed: true,
                    orderItems: cart,
                    billingInfo: {
                        fname: faker.name.firstName(),
                        lname: faker.name.lastName(),
                        email: faker.internet.email(),
                        address: {
                            street: faker.address.streetAddress(),
                            city: faker.address.city(),
                            state: faker.address.state()
                        }
                    },
                    paymentInfo: {
                        checkoutDate: Math.floor(Math.random() * 1492879911),
                        totalCharge: h.itemsTotal(cart) * 100,
                        stripeToken: "tok_" + faker.random.uuid(),
                        cardType: "Visa"
                    }
                });
                orders.push(order);
            }

            // ----------------------------------------
            // Finish
            // ----------------------------------------
            console.log('Saving...');

            var promises = [];
            [
                orders,

            ].forEach((collection) => {
                collection.forEach((model) => {
                    promises.push(model.save());
                });
            });
            return Promise.all(promises);
        });

};
