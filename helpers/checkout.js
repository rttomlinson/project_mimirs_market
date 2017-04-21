var CheckoutHelper = {};


CheckoutHelper.checkoutPath = () => '/checkout/';
CheckoutHelper.itemSubtotal = (price, quantity) => {
    return price * quantity;
};
CheckoutHelper.itemsTotal = (cart) => {
    if (cart.length) {
        return cart.reduce((acc, item) => {
            return acc += item.quantity * item.price;
        }, 0);
    }
    else {
        return 0;
    }
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
