"use strict";
const express = require('express');
const router = express.Router();
var {
    STRIPE_SK_TEST,
    STRIPE_PK_TEST
} = process.env;
var stripe = require('stripe')(STRIPE_SK_TEST);
const Order = require('../models/mongoose').Order;



router.get('/', (req, res, next) => {
    res.render('charges/new', {
        STRIPE_PK_TEST
    });
});

router.post('/', (req, res, next) => {
    var charge = req.body;

    console.log("charge", charge);
    //grab stripe Token here
    req.session.currentUser.stripeToken = charge.stripeToken;
    stripe.charges.create({
            amount: charge.amount,
            currency: 'usd',
            description: "Sweet sweet goods",
            source: charge.stripeToken
        })
        .then((charge) => {
            console.log("charge", charge);
            //extract

            //convert data in cart to an array
            //get card type and amount here
            // ... Save charge and session data
            return Order.findByIdAndUpdate({
                _id: req.session.currentUser.orderId
            }, {
                $set: {
                    completed: true,
                    orderItems: req.session.currentUser.cart,
                    paymentInfo: {
                        checkoutDate: charge.created,
                        totalCharge: charge.amount,
                        stripeToken: req.session.currentUser.stripeToken,
                        cardType: charge.source.brand
                    }
                }
            });
        }).then(() => {
            //clear the cart and the session
            //redirect to the products page
            req.session.currentUser = {};
            req.session.currentUser.cart = [];
        })
        .then(() => {

            res.redirect('/charges/complete');

        })
        .catch(next);
});

router.get('/complete', function(req, res, next) {
    req.flash('success', 'Payment successful!');
    res.render('charges/complete');
});

module.exports = router;
