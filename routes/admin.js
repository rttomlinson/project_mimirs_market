"use strict";
const express = require('express');
let router = express.Router();
let mongooseModels = require('../models/mongoose');
let sequelizeModels = require('../models/sequelize');
let Product = sequelizeModels.Product;
let Category = sequelizeModels.Category;
let Order = mongooseModels.Order;
let h = require('../helpers').registered;

router.get('/orders', function(req, res, next) {
    Order.find({})
        .then((orders) => {
            orders = orders.map((order) => {
                let tempObj = {};
                tempObj._id = order._id;
                tempObj.checkoutDate = order.paymentInfo.checkoutDate;
                tempObj.description = h.itemNames(order.orderItems);
                tempObj.revenue = h.USDollars(order.paymentInfo.totalCharge);
                tempObj.customerEmail = order.billingInfo.email;
                tempObj.customerState = order.billingInfo.address.state;
                return tempObj;
            });
            return orders;
        })
        .then((orders) => {
            res.render('admin/index', {
                orders
            });
        })
        .catch(next);
});

router.get('/order/:id', function(req, res, next) {
    let id = req.params.id;
    Order.findById(id, {})
        .then((orderInfo) => {
            console.log("orderInfo", orderInfo);
            res.render('admin/show', {
                orderInfo
            });
        })
        .catch(next);
});


router.get('/analytics', function(req, res, next) {

    //Query to get totals of all orders
    let totalsTable = {};
    //Query for total revenue
    Order.aggregate([{
            $group: {
                _id: null,
                total: {
                    $sum: '$paymentInfo.totalCharge'
                }
            }
        }])
        .then((orderInfo) => {
            totalsTable.totalRevenue = orderInfo[0].total;
            //Query for total units sold
            return Order.mapReduce({
                map: function() {
                    //loop through orderItems and grab quantities
                    let keys = Object.keys(this.orderItems);
                    let totalUnits = keys.reduce((acc, key) => {
                        return acc += this.orderItems[key].quantity;
                    }, 0);
                    emit(null, totalUnits);
                },
                reduce: function(keys, values) {
                    return Array.sum(values);
                }
            });

        })
        .then((totalUnits) => {
            console.log("totalUnits", totalUnits);
            totalsTable.totalUnitsSold = totalUnits[0].value;
            //Total transactions/total orders
            return Order.mapReduce({
                map: function() {
                    //loop through orderItems and grab quantities
                    emit(null, 1);
                },
                reduce: function(keys, values) {
                    return Array.sum(values);
                },
                query: {
                    completed: true
                }
            });
        })
        .then((totalTransactions) => {
            console.log("totalTransactions", totalTransactions);
            totalsTable.totalTransactions = totalTransactions[0].value;
            //Get total unique customers
            return Order.aggregate([{
                $group: {
                    _id: '$billingInfo.email',
                    total: {
                        $sum: 1
                    }
                }
            }, {
                $group: {
                    _id: null,
                    total: {
                        $sum: 1
                    }
                }
            }]);
        })
        .then((customers) => {
            console.log("customers", customers);
            totalsTable.totalCustomers = customers[0].total;
            //get total products
            return Product.count({});

        })
        .then((totalProducts) => {
            console.log("Total products", totalProducts);
            totalsTable.totalProducts = totalProducts;
            //Get total categories
            return Category.count({});


        })
        .then((totalCategories) => {
            console.log("total categories", totalCategories);
            totalsTable.totalCategories = totalCategories;
            //Get total states sold to
            return Order.distinct(
                "billingInfo.address.state", {});

        })
        .then((statesSoldTo) => {
            console.log("distinct states", statesSoldTo.length);
            totalsTable.statesSoldTo = statesSoldTo.length;

            //Get revenue per product
            return Order.aggregate([{
                $unwind: "$orderItems"
            }, {
                $project: {
                    _id: 0,
                    "orderItems.name": 1,
                    "orderItems.price": 1,
                    "orderItems.quantity": 1
                }
            }, {
                $group: {
                    _id: "$orderItems.name",
                    total: {
                        $sum: {
                            $multiply: ["$orderItems.price", "$orderItems.quantity"]
                        }
                    }
                }
            }]);
        })
        .then((revenueByProduct) => {
            console.log("revenue by product", revenueByProduct);
            revenueByProduct = revenueByProduct.map((product) => {
                return {
                    identifier: product._id,
                    total: product.total
                };
            });
            totalsTable.revenueByProduct = revenueByProduct;
            //Get revenue by state
            return Order.aggregate([{
                $unwind: "$orderItems"
            }, {
                $project: {
                    _id: 0,
                    "billingInfo.address.state": 1,
                    "orderItems.name": 1,
                    "orderItems.price": 1,
                    "orderItems.quantity": 1
                }
            }, {
                $group: {
                    _id: "$billingInfo.address.state",
                    total: {
                        $sum: {
                            $multiply: ["$orderItems.price", "$orderItems.quantity"]
                        }
                    }
                }
            }]);
        })
        .then((revenueByState) => {
            console.log("revenueByState", revenueByState);
            revenueByState = revenueByState.map((product) => {
                return {
                    identifier: product._id,
                    total: product.total
                };
            });
            totalsTable.revenueByState = revenueByState;
            //Get revenue by category
            //First get the products with the category names
            return Category.findAll({
                    raw: true
                })
                .then(categories => {
                    let categoryObj = {};
                    categories.forEach((category) => {
                        categoryObj[category.id] = category.name;
                    });

                    //Get revenue by category from orders
                    return Order.aggregate([{
                            $unwind: "$orderItems"
                        }, {
                            $project: {
                                _id: 0,
                                "orderItems.price": 1,
                                "orderItems.quantity": 1,
                                "orderItems.category_id": 1
                            }
                        }, {
                            $group: {
                                _id: "$orderItems.category_id",
                                total: {
                                    $sum: {
                                        $multiply: ["$orderItems.price", "$orderItems.quantity"]
                                    }
                                }
                            }
                        }])
                        .then((revenueByCategory) => {
                            //map to products
                            return revenueByCategory.map((category) => {
                                return {
                                    //CategoryObj has names of category corresponding to its ID
                                    identifier: categoryObj[category._id],
                                    total: category.total
                                }
                            })
                        });
                });
        })
        .then((revenueByCategory) => {
            console.log("revenueByCategory", revenueByCategory);
            totalsTable.revenueByCategory = revenueByCategory;
        })
        .then(() => {
            res.render('admin/analytics', {
                totalsTable
            });
        })
        .catch(next);
});

module.exports = router;






/**Turns an object into an array
 *
 */
function formatItems(items) {
    let keys = Object.keys(items);
    return keys.map((key) => {
        return items[key];
    });
}



/**
 * totalsTable = {
     totalRevenue: <Number>,
     totalUnitsSold: <Number>,
     totalCustomers: <Number>,
     totalProducts: <Number>,
     totalCategories: <Number>,
     statesSoldTo: <Number>,
     revenueByProduct: [{
         identifier: <String>,
         total: <Number>
     }],
     revenueByState: [{
         identifier: <String>,
         total: <Number>
     }],
     revenueByCategory: [{
         identifier: <String>,
         total: <Number>
     }]
 }
 *
 *
 *
 *
 */







/**
 * Order Object
 * {
     completed: <Boolean>,
     billingInfo: {
         fname: <String>,
         lname: <String>,
         email: <String>,
         address: {
             street: <String>,
             city: <String>,
             state: <String>
         }
     },
     paymentInfo:{
         checkoutDate: <String>,
         totalCharge: <Number>,
         stripeToken: <String>,
         cartType: <String>
     },
     orderItems: [
         {
             name: <String>,
             sku: <Number>,
             description: <String>,
             price: <Number>,
             category_id: <Number>,
             image_url: <String>,
             quantity: <Number>
         }
     ]
 }
 */
