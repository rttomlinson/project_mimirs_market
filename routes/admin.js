"use strict";
const express = require('express');
let router = express.Router();
let h = require('../helpers').registered;

router.get('/orders', function(req, res, next) {
    h.getOrders()
        .then((orders) => {
            res.render('admin/index', {
                orders
            });
        })
        .catch((err) => {
            console.log("An error occurred while getting data");
            console.log(err.message);
            console.log(err.stack);
            next(err);
        });
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
    console.log("inside router for analytics");

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
    console.log("calling getAnalyticsData");
    //Query to get totals of all orders
    let totalsTable = {};
    //Query for total revenue
    totalsTable.totalRevenue = await h.getTotalRevenue();
    console.log("calling totalREvenue");

    totalsTable.totalUnitsSold = await h.getUnitsSold();
    console.log("calling unitsSold");

    totalsTable.totalTransactions = await h.getTotalTransactions();
    console.log("calling totalTransactions");

    totalsTable.totalCustomers = await h.getTotalCustomers();
    console.log("calling totalCustomer");

    totalsTable.totalProducts = await h.getTotalProducts();
    console.log("calling totalProducts");

    totalsTable.totalCategories = await h.getTotalCategories();
    console.log("calling totalCategories");

    totalsTable.statesSoldTo = await h.getStatesSoldTo();
    console.log("calling getStatesSoldTo");

    totalsTable.revenueByProduct = await h.getRevenueByProduct();
    console.log("calling getRevenueByProduct");

    totalsTable.revenueByState = await h.getRevenueByState();
    console.log("calling getRevenueByState");

    totalsTable.revenueByCategory = await h.getRevenueByCategory();
    console.log("calling getRevenueByCategory");


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
