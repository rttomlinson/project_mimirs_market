"use strict";

let mongooseModels = require('../models/mongoose');
let sequelizeModels = require('../models/sequelize');
let Product = sequelizeModels.Product;
let Category = sequelizeModels.Category;
let Order = mongooseModels.Order;
let moneyHelper = require('./money');
let checkoutHelper = require('./checkout');
let timeHelper = require('./time');

let AnalyticsHelper = {};

AnalyticsHelper.getOrders = async function() {
    let orders = await Order.find({
        completed: true
    });
    console.log("orders", orders);
    orders = orders.map((order) => {
        let tempObj = {};
        tempObj._id = order._id;
        tempObj.checkoutDate = timeHelper.secondsToDate(order.paymentInfo.checkoutDate);
        tempObj.description = checkoutHelper.itemNames(order.orderItems);
        tempObj.revenue = moneyHelper.USDollars(moneyHelper.centsToDollars(order.paymentInfo.totalCharge));
        tempObj.customerEmail = order.billingInfo.email;
        tempObj.customerState = order.billingInfo.address.state;
        return tempObj;
    });
    return orders;
};

AnalyticsHelper.getOrder = async function(id) {
    let orders = await Order.findById(id, {});
    return orders;
};


AnalyticsHelper.getTotalRevenue = async function() {
    let orderInfo = await Order.aggregate([{
        $match: {
            completed: true
        }
    }, {
        $group: {
            _id: null,
            total: {
                $sum: '$paymentInfo.totalCharge'
            }
        }
    }]);
    return orderInfo[0].total;
};

AnalyticsHelper.getUnitsSold = async function() {
    let orderInfo = await Order.mapReduce({
        map: function() {
            //loop through orderItems and grab quantities
            let keys = Object.keys(this.orderItems);
            let totalUnits = keys.reduce((acc, key) => {
                return acc += this.orderItems[key].quantity;
            }, 0);
            console.log("about to call emit", emit);
            emit(null, totalUnits);
        },
        reduce: function(keys, values) {
            return Array.sum(values);
        }
    });
    console.log("orderInfo", orderInfo);
    return orderInfo[0].value;
};


AnalyticsHelper.getTotalTransactions = async function() {
    let orderInfo = await Order.mapReduce({
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
    return orderInfo[0].value;
};


AnalyticsHelper.getTotalCustomers = async function() {
    let orderInfo = await Order.aggregate([{
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
    return orderInfo[0].total;
};

AnalyticsHelper.getTotalProducts = async function() {
    return await Product.count({});
};

AnalyticsHelper.getTotalCategories = async function() {
    return await Category.count({});
};

AnalyticsHelper.getStatesSoldTo = async function() {
    let statesArray = await Order.distinct(
        "billingInfo.address.state", {});
    return statesArray.length;
};

AnalyticsHelper.getRevenueByProduct = async function() {
    let revenueByProduct = await Order.aggregate([{
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
    return revenueByProduct.map((product) => {
        return {
            identifier: product._id,
            total: product.total
        };
    });
};


AnalyticsHelper.getRevenueByState = async function() {
    let revenueByState = await Order.aggregate([{
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
    return revenueByState.map((product) => {
        return {
            identifier: product._id,
            total: product.total
        };
    });
};

AnalyticsHelper.getRevenueByCategory = async function() {
    //Get all categories
    let categories = await Category.findAll({
        raw: true
    });
    //map category ids to category names. will be used at end
    let categoriesObj = {};
    categories.forEach((category) => {
        categoriesObj[category.id] = category.name;
    });

    //Get revenue by category from orders
    let revenueByCategory = await Order.aggregate([{
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
    }]);
    //map to cateogory names
    return revenueByCategory.map((category) => {
        return {
            //CategoryObj has names of category corresponding to its ID
            identifier: categoriesObj[category._id],
            total: category.total
        };
    });
};
module.exports = AnalyticsHelper;
