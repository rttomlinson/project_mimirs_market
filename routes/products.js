"use strict";
const express = require('express');
const router = express.Router();
const Product = require('../models/sequelize').Product;
const Category = require('../models/sequelize').Category;


router.get('/', parseQueryData, (req, res, next) => {


    //homepage - products display
    let categories;

    Category.findAll({
            attributes: ['name', 'id'],
            raw: true
        })
        .then((_categories) => {
            categories = _categories;
        })
        .then(() => {
            return Product.findAll({
                where: {
                    $and: req.session.productsQueryString
                },
                raw: true
            });
        })
        .then((products) => {
            //if no products send flash message
            if (!products.length) {
                req.flash('alert', 'No products!!!!!');
            }
            res.render('products/index', {
                products,
                categories
            });
        })
        .catch(next);
});



router.get('/:id', function(req, res, next) {
    let productId = req.params.id;
    let product;
    Product.findById(productId, {
            raw: true
        })
        .then((mainProduct) => {
            product = mainProduct;
            return Product.findAll({
                where: {
                    category_id: product.category_id,
                    id: {
                        $ne: product.id
                    }
                },
                limit: 3
            });
        })
        .then(suggestedProducts => {
            res.render('products/show', {
                product,
                suggestedProducts
            });
        })
        .catch(next);
});


module.exports = router;

function parseQueryData(req, res, next) {
    req.session.productsQuery = '[';
    let pqs = req.session.productsQuery;

    if (req.query.form) {
        //check for search
        if (req.query.form.search) {
            `{name: { $iLike: "%${req.query.form.search}%"}},`

        }
        if (req.query.form.minPrice) {
            `{price: { $gt : ${req.query.form.minPrice}}},`

        }
        if (req.query.form.maxPrice) {
            `{price: { $lt : ${req.query.form.maxPrice}}},`

        }
        if (req.query.form.category) {
            if (req.query.form.category !== "all") {
                `{category_id: ${req.query.form.category}}`
            }
        }
    }
    //check for trailing comma and get rid of it if necessary
    if ()
        pqs += ']';
    req.session.productsQuery = JSON.parse(pqs);
    next();
}
