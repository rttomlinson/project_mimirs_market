"use strict";
const express = require('express');
const router = express.Router();
const Product = require('../models/sequelize').Product;
const Category = require('../models/sequelize').Category;


router.get('/', (req, res, next) => {
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
          raw: true
        })
      })  
      .then((products) => {
          res.render('products/index', {products, categories});
      })
      .catch((err) => next(err));
});





module.exports = router;
