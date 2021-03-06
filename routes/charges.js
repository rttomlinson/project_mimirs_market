"use strict";
const express = require('express');
const router = express.Router();
var {
    STRIPE_SK_TEST,
    STRIPE_PK_TEST
} = process.env;
var stripe = require('stripe')(STRIPE_SK_TEST);
const Order = require('../models/mongoose').Order;
const h = require('../helpers').registered;

router.get('/', (req, res, next) => {
    res.render('charges/new', {
        STRIPE_PK_TEST
    });
});

router.post('/', (req, res, next) => {
    var charge = req.body;
    //grab stripe Token here
    req.session.currentUser.stripeToken = charge.stripeToken;
    stripe.charges.create({
            amount: charge.amount,
            currency: 'usd',
            description: "Sweet sweet goods",
            source: charge.stripeToken
        })
        .then((charge) => {
            //extract
            console.log("successful charge", charge);
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
            req.session.currentUser._cartIndex = {};

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
