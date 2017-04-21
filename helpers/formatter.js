const cformatter = require('currency-formatter');


let Formatter = {};


Formatter.USDollars = function(num) {
    return cformatter.format(num, {
        code: 'USD'
    });
};


module.exports = Formatter;
