"use strict";
const express = require('express');
const router = express.Router();
const db = require('../models/sequelize');
const Product = db.Product;
const Category = db.Category;
const h = require('../helpers').registered;


router.get('/', function(req, res, next) {
    //Get keys of the items in the cart
    let userCart = req.session.currentUser.cart;
    res.render('cart/index', {
        products: userCart
    });
});



router.post('/inc/:id', function(req, res, next) {
    let userCart = req.session.currentUser.cart;
    let itemId = req.params.id;
    let p = new Promise((resolve, reject) => {
        //If cart doesn't exist and want to increase
        //attempt to find matching item id in cart
        let item = userCart.find((product) => {
            return itemId === product._id;
        });
        if (!item) {
            Product.findById(itemId, {
                    // include: [{
                    //     model: Category
                    // }],
                    raw: true
                })
                .then((product) => {
                    product["quantity"] = 1;
                    userCart.push(product);
                    resolve();
                })
                .catch(reject);
        }
        else {
            item.quantity += 1;
            resolve();
        }
    });
    p.then(() => {
            res.redirect(h.cartPath());
        })
        .catch(next);
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
        let item = userCart.find((product) => {
            return itemId === product._id;
        });
        item.quantity = +quantity;
        res.redirect(h.cartPath());
    }

});

router.delete('/remove/:id', function(req, res, next) {
    let userCart = req.session.currentUser.cart;
    let itemId = req.params.id;
    let item = userCart.find((product) => {
        return itemId === product._id;
    });
    if (item) {
        item = void 0;
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
