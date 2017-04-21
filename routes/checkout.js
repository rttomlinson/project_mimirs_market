"use strict";
const express = require('express');
const router = express.Router();
const Order = require('../models/mongoose').Order;


router.get('/', (req, res, next) => {
    res.render('checkout/index');
});


router.post('/', (req, res, next) => {
    //save billing into
    let billingInfo = req.body.form;
    let fname = billingInfo.fname;
    let lname = billingInfo.lname;
    let email = billingInfo.email;
    let address = billingInfo.address;


    //save billing info mongoose
    //... Start using the MongoDB connection
    let order = new Order({
        completed: false,
        billingInfo: {
            fname: fname,
            lname: lname,
            email: email,
            address: address
        },
        orderItems: [],
        paymentInfo: {}
    });
    order.save()
        .then((order) => {
            //get order number and save in current session
            req.session.currentUser.orderId = order._id;
            //redirect to payment page
            res.redirect('/charges');
        });
});


module.exports = router;
