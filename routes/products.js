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
                    $and: req.session.productsQuery
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
                        $ne: productId
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
    let pqs = '[';

    if (req.query.form) {
        //check for search
        if (req.query.form.search) {
            pqs += `{"name": { "$iLike": "%${req.query.form.search}%"}},`;

        }
        if (req.query.form.minPrice) {
            pqs += `{"price": { "$gt" : ${req.query.form.minPrice}}},`;

        }
        if (req.query.form.maxPrice) {
            pqs += `{"price": { "$lt" : ${req.query.form.maxPrice}}},`;

        }
        if (req.query.form.category) {
            if (req.query.form.category !== "all") {
                pqs += `{"category_id": ${req.query.form.category}}`;
            }
        }
    }
    //check for trailing comma and get rid of it if necessary
    if (pqs.slice(-1) === ',') {
        pqs = pqs.slice(0, -1);
    }
    pqs += ']';
    console.log("pqs", pqs);
    req.session.productsQuery = JSON.parse(pqs);
    next();
}
