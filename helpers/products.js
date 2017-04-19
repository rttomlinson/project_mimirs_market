var ProductsHelper = {};


ProductsHelper.productsPath = () => '/products/';
ProductsHelper.productPath = (id) => `/products/${ id }`;


module.exports = ProductsHelper;