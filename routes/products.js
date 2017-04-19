"use strict";
const express = require('express');
const router = express.Router();
const Product = require('../models/sequelize').Product;
const Category = require('../models/sequelize').Category;


router.get('/', (req, res, next) => {
    let formInfo = req.query.form;
    let search = formInfo.search;
    let minPrice = formInfo.minPrice;
    let maxPrice = formInfo.maxPrice;
    let category = formInfo.category;



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
                include: [{model: Category}],
                where: {
                    name: {
                        $iLike: `%${search}%`
                    },
                    price: {
                        $between: [minPrice, maxPrice]
                    },
                    category_id: {in: [category].length ? [category] : Category.defaultValues(),
                    raw: true
                }
            });
        })
        .then((products) => {
          console.log(products)
            res.render('products/index', {
                products,
                categories
            });
        })
        .catch((err) => next(err));
});





module.exports = router;
