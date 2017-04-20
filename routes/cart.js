"use strict";
const express = require('express');
const router = express.Router();
const Product = require('../models/sequelize').Product;
const h = require('../helpers').registered;

router.use(function(req, res, next) {
    //currentUser not yet defined
    //first set default for that
    if (!req.session.currentUser) {
        req.session.currentUser = {};
    }
    if (!req.session.currentUser.cart) {
        req.session.currentUser.cart = {};
    }
    next();
});


router.get('/', function(req, res, next) {
    //Get keys of the items in the cart
    let userCart = req.session.currentUser.cart;
    let keys = Object.keys(userCart);
    let cartItems = keys.map((key) => {
        return userCart[key];
    });
    res.render('cart/index', {
        products: cartItems
    });
});



router.post('/inc/:id', function(req, res, next) {
    let userCart = req.session.currentUser.cart;
    let itemId = req.params.id;
    let p = new Promise((resolve, reject) => {
        //If cart doesn't exist and want to increase
        if (!userCart[itemId]) {
            Product.findById(itemId, {
                    raw: true
                })
                .then((product) => {
                    userCart[itemId] = product;
                    userCart[itemId].quantity = 1;
                    resolve();
                })
                .catch(reject);
        }
        else {
            userCart[itemId].quantity += 1;
            resolve();
        }
    });
    p.then(() => {
            res.redirect(h.cartPath());
        })
        .catch(next);
});

router.post('/dec/:id', function(req, res, next) {
    let userCart = req.session.currentUser.cart;
    let itemId = req.params.id;
    if (userCart[itemId]) {
        userCart[itemId].quantity -= 1;
    }
    if (userCart[itemId].quantity < 0) {
        res.redirect(h.cartItemDestroyPath(itemId));
    }
    else {
        res.redirect(h.cartPath());
    }
});

router.post('/update/:id', function(req, res, next) {
    let itemId = req.params.id;
    let quantity = req.body.quantity;
    if (!quantity) {
        res.redirect(h.cartPath());
    }
    else if (quantity < 0) {
        res.redirect(h.cartItemDestroyPath(itemId));
    }
    else {
        let userCart = req.session.currentUser.cart;
        userCart[itemId].quantity = +quantity;
        res.redirect(h.cartPath());
    }

});


router.delete('/remove/:id', function(req, res, next) {
    let userCart = req.session.currentUser.cart;
    let itemId = req.params.id;
    if (userCart[itemId]) {
        userCart[itemId] = void 0;
    }
    req.method = 'GET';
    res.redirect(h.cartPath());
});


router.delete('/', function(req, res, next) {
    if (req.session) {
        req.session.destroy();
    }
    req.method = 'GET';
    res.redirect('/products');
});



module.exports = router;
