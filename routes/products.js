"use strict";
const express = require('express');
const router = express.Router();
const Product = require('../models/sequelize').Product;
const Category = require('../models/sequelize').Category;


router.get('/', parseQueryData, (req, res, next) => {
    //Get data from query form
    let category = req.query.form.category;
    let search = req.query.form.search;
    let minPrice = req.query.form.minPrice;
    let maxPrice = req.query.form.maxPrice;

    //homepage - products display
    let categories;

    Category.findAll({
            attributes: ['name'],
            raw: true
        })
        .then((_categories) => {
            categories = _categories.map((el) => {
                return el.name;
            });
        })
        .then(() => {
            return Product.findAll({
                include: [{
                    model: Category,
                    where: {
                        name: { in: category
                        }
                    }
                }],
                where: {
                    name: {
                        $iLike: `%${search}%`
                    },
                    price: {
                        $between: [minPrice, maxPrice]
                    }
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
        .catch((err) => next(err));
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
    if (req.query.form) {
        req.query.form.search = req.query.form.search || Product.defaultSearchValue();
        req.query.form.minPrice = req.query.form.minPrice || Product.defaultMinValue();
        req.query.form.maxPrice = req.query.form.maxPrice || Product.defaultMaxValue();
        if (req.query.form.category) {
            if (req.query.form.category === "all") {
                req.query.form.category = Category.defaultCategory();
            }
        }
        else {
            req.query.form.category = Category.defaultCategory();
        }
    }
    else {
        req.query.form = {};
        req.query.form.search = Product.defaultSearchValue();
        req.query.form.minPrice = Product.defaultMinValue();
        req.query.form.maxPrice = Product.defaultMaxValue();
        req.query.form.category = Category.defaultCategory();
    }

    if (!Array.isArray(req.query.form.category)) {
        req.query.form.category = [req.query.form.category];
    }
    next();
}
