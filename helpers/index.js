// helpers/index.js

var fs = require('fs');
var path = require('path');
var basename = path.basename(__filename);


var Helpers = {};


// Object to hold registered helpers
Helpers.registered = {};


// Register a single helper or
// a module
Helpers.register = function(key, fn) {
    if (typeof key === 'object') {

        // Iterate through keys
        var helpers = key;
        for (var key in helpers) {

            // Register helper function
            let fn = helpers[key];
            this.registered[key] = fn;
        }
    }
    else {

        // Register a single helper
        // function
        this.registered[key] = fn;
    }
};


// Register all helper files
var files = fs.readdirSync(__dirname);
files.forEach((filename) => {

    // If the file is not this file
    if (filename !== basename) {

        // Require it and register its
        // helpers
        var helperModule = require(`./${ filename }`);
        Helpers.register(helperModule);
    }
});


module.exports = Helpers;
