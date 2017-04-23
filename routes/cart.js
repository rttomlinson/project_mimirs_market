"use strict";
const express = require('express');
const router = express.Router();
const db = require('../models/sequelize');
const Product = db.Product;
const h = require('../helpers').registered;


router.get('/', function(req, res, next) {
    //Get keys of the items in the cart
    let userCart = req.session.currentUser.cart;
    if (userCart.length === 0) {
        req.flash('notice', 'Shopping cart is empty!');
    }
    res.render('cart/index', {
        products: userCart
    });
});

router.post('/update/:id', function(req, res, next) {
    let itemId = req.params.id;
    let quantity = req.body.quantity;
    let userCart = req.session.currentUser.cart;
    let _cartIndex = req.session.currentUser._cartIndex;
    console.log("same obj here?", req.session.currentUser.cart[0] === req.session.currentUser._cartIndex[itemId]);
    //see if item is already in the cart
    if (_cartIndex[itemId]) {
        //just update the quantity
        if (!quantity) {
            res.redirect(h.cartPath());
        }
        else if (quantity < 0) {
            res.redirect(h.cartItemDestroyPath(itemId));
        }
        else {
            _cartIndex[itemId].quantity = +quantity;
            //find corresponding item in the array
            let product = userCart.find(function(item) {
                return item.id == itemId;
            });
            product.quantity = +quantity;
            res.redirect(h.cartPath());
        }
    }
    else {
        Product.findById(itemId, {
                raw: true
            })
            .then(function(product) {
                product["quantity"] = 1;
                //Add the item by id to the cart indexer
                _cartIndex[itemId] = product;
                //Add the item to the cart array
                userCart.push(_cartIndex[itemId]);
                //Go to shopping cart
                res.redirect(h.cartPath());
            })
            .catch(next);
    }
});

router.delete('/remove/:id', function(req, res, next) {
    let userCart = req.session.currentUser.cart;
    let _cartIndex = req.session.currentUser._cartIndex;
    let itemId = req.params.id;
    let item = userCart.find((product) => {
        return itemId === product.id;
    });
    if (item) {
        item = void 0;
    }
    if (_cartIndex[itemId]) {
        _cartIndex[itemId] = void 0;
    }
    req.method = 'GET';
    res.redirect(h.cartPath());
});

router.delete('/', function(req, res, next) {
    if (req.session) {
        req.session.currentUser.cart = [];
        req.session.currentUser._cartIndex = {};
    }
    req.flash('success', 'Shopping cart cleared');
    req.method = 'GET';
    res.redirect('/products');
});

module.exports = router;
