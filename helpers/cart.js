var CartHelper = {};


CartHelper.cartPath = () => '/cart/';
CartHelper.cartDestroyPath = () => `/cart/?_method=delete`;
CartHelper.cartIncPath = (id) => `/cart/inc/${id}`;
CartHelper.cartDecPath = (id) => `/cart/dec/${id}`;
CartHelper.cartItemDestroyPath = (id) => `/cart/remove/${id}/?_method=delete`;


module.exports = CartHelper;
