const moneyHelper = require('./money');

var CheckoutHelper = {};


CheckoutHelper.checkoutPath = () => '/checkout/';
CheckoutHelper.itemSubtotal = (price, quantity) => {
    return moneyHelper.USDollars(price * quantity);
};
CheckoutHelper.itemsTotal = (cart) => {
    let total = 0;
    if (cart.length) {
        total = cart.reduce((acc, item) => {
            return acc += item.quantity * item.price;
        }, 0);
    }
    return moneyHelper.USDollars(total);
};


/**Returns an array of objects with product names and ids
 *
 *
 **/
CheckoutHelper.itemNames = (cart) => {
    if (cart.length) {
        return cart.map((product) => {
            return {
                name: product.name,
                id: product.id
            };
        });
    }
    else {
        return [];
    }
};




module.exports = CheckoutHelper;
