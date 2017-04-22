var CartHelper = {};


CartHelper.cartPath = () => '/cart/';
CartHelper.cartDestroyPath = () => `/cart/?_method=delete`;
CartHelper.cartUpdatePath = (id) => `/cart/update/${id}`;
CartHelper.cartItemDestroyPath = (id) => `/cart/remove/${id}/?_method=delete`;

module.exports = CartHelper;
