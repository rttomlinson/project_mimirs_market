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

    h.getOrders()
        .then((orders) => {
            res.render('admin/index', {
                orders
            });
        })
        .catch(next);
});

router.get('/order/:id', function(req, res, next) {
    let id = req.params.id;

    h.getOrder(id)
        .then((orderInfo) => {
            console.log("orderInfo", orderInfo);
            res.render('admin/show', {
                orderInfo
            });
        })
        .catch(next);
});


router.get('/analytics', function(req, res, next) {

    getAnalyticsData()
        .then((totalsTable) => {
            res.render('admin/analytics', {
                totalsTable
            });
        })
        .catch(next);
});

module.exports = router;



async function getAnalyticsData() {
    //Query to get totals of all orders
    let totalsTable = {};
    //Query for total revenue
    totalsTable.totalRevenue = await h.getTotalRevenue();
    totalsTable.totalUnitsSold = await h.getUnitsSold();
    totalsTable.totalTransactions = await h.getTotalTransactions();
    totalsTable.totalCustomers = await h.getTotalCustomers();
    totalsTable.totalProducts = await h.getTotalProducts();
    totalsTable.totalCategories = await h.getTotalCategories();
    totalsTable.statesSoldTo = await h.getStatesSoldTo();
    totalsTable.revenueByProduct = await h.getRevenueByProduct();
    totalsTable.revenueByState = await h.getRevenueByState();
    totalsTable.revenueByCategory = await h.getRevenueByCategory();

    return totalsTable;

};





////////////////Data structure//////////////
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
