var CartHelper = {};


CartHelper.cartPath = () => '/cart/';
CartHelper.cartDestroyPath = () => `/cart/?_method=delete`;
CartHelper.cartUpdatePath = (id) => `/cart/update/${id}`;
CartHelper.cartItemDestroyPath = (id) => `/cart/remove/${id}/?_method=delete`;

CartHelper.checkIfInCart = function(cartIndex, index) {
    console.log("cartIndex is", cartIndex);
    if (cartIndex[index]) {
        return true;
    }
    else {
        return false;
    }
};

module.exports = CartHelper;
