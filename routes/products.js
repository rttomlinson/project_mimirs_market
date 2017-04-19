"use strict";
const express = require('express');
const router = express.Router();
const Product = require('../models/sequelize').Product;


router.get('/', (req, res, next) => {
  //homepage - products display
  Product.findAll()
    .then((products)) => {
      console.log(products);
      res.render('products/index', {products});
    });
    .catch((err) => next(err))
})