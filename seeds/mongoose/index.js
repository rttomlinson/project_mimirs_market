var mongoose = require('mongoose');
var models = require('../../models/mongoose');

// Assign models to the global namespace
// so we can reference them easily
// in seeds/seeds.js
Object.keys(models).forEach((modelName) => {
    global[modelName] = mongoose.model(modelName);
});

// Connect to MongoDB
require('../../mongo')()

// Clean the database
.then(() => console.log('Cleaning Database...'))
    .then(() => {
        return require('./clean')();
    })

// Seed the data
.then(() => console.log('Seeding...'))
    .then(() => {
        return require('./seeds')();
    })

// Success!
.then(() => console.log('Done'))

// Fail :(
.catch((e) => console.error(e))

// Always disconnect
.then(() => mongoose.disconnect());
