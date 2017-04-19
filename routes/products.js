"use strict";
const express = require('express');
const router = express.Router();
const Product = require('../models/sequelize').Product;
const Category = require('../models/sequelize').Category;


router.get('/', (req, res, next) => {
    let formInfo = req.query.form;
    let search;
    let minPrice;
    let maxPrice;
    let category;
    if (!formInfo) {
        search = Product.defaultSearchValue();
        minPrice = Product.defaultMinValue();
        maxPrice = Product.defaultMaxValue();
        category = Category.defaultCategory();
    }
    else {
        search = formInfo.search || Product.defaultSearchValue();
        minPrice = formInfo.minPrice || Product.defaultMinValue();
        maxPrice = formInfo.maxPrice || Product.defaultMaxValue();
        if(formInfo.category && formInfo.category === "all") {
          category = Category.defaultCategory();
        } else if (formInfo.category) {
          category = formInfo.category;
        } else {
          category = Category.defaultCategory();
        }
    }

    if(!Array.isArray(category)){
      category = [category];
    }

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
          req.flash('alert', 'No products!!!!!');
            res.render('products/index', {
                products,
                categories
            });
        })
        .catch((err) => next(err));
});





module.exports = router;
