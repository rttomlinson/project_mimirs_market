var CheckoutHelper = {};


CheckoutHelper.checkoutPath = () => '/checkout/';
CheckoutHelper.itemSubtotal = (price, quantity) => {
    return price * quantity;
};
CheckoutHelper.itemsTotal = (cart) => {
    let items = Object.keys(cart);
    return items.reduce((acc, item) => {
        return acc += cart[item].quantity * cart[item].price;
    }, 0);
};


module.exports = CheckoutHelper;
