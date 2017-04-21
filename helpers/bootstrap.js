// helpers/bootstrapBootstrap.js

var BootstrapHelper = {};


BootstrapHelper.xsColWidth = function(width) {
    if (!width) {
        width = 12;
    }
    return `col-xs-${width}`;
};


module.exports = BootstrapHelper;
