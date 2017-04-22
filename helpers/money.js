const cformatter = require('currency-formatter');

let Formatter = {};

Formatter.USDollars = function(num) {
    return cformatter.format(num, {
        code: 'USD'
    });
};

Formatter.centsToDollars = function(num) {
    return Math.round(num) / 100;
};


module.exports = Formatter;
